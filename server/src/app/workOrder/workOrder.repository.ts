import {
  WorkOrder,
  workOrderColumns,
  WorkOrderStatus,
} from 'app/workOrder/workOrder.model';
import { User } from 'app/user/user.model';
import { getRepository, SelectQueryBuilder } from 'typeorm';
import { Pod } from 'app/pod/pod.model';
import { Skill } from 'app/skills/skill.model';
import { Task, TaskStatus } from 'app/task/task.model';

export type getWorkOrdersStatus =
  | 'active'
  | 'inactive'
  | 'available'
  | 'review';

type SelectorName = 'podName' | 'makers' | 'skills' | 'quantityAvailable';

export type WorkOrderQueryParams = {
  select?: readonly (typeof workOrderColumns[number] | SelectorName)[];
  id?: number;
  active?: boolean;
  status?: getWorkOrdersStatus;
  user?: User;
  limit?: number;
  offset?: number;
};

const selectors: Record<
  SelectorName,
  <T extends SelectQueryBuilder<WorkOrder>>(
    query: T,
    params: WorkOrderQueryParams,
  ) => T
> = {
  podName(query) {
    const subquery = query
      .subQuery()
      .select('name')
      .from(Pod, 'pod')
      .where('"pod"."id" = "workOrder"."podId"');

    return query.addSelect(`(${subquery.getQuery()}) AS "podName"`);
  },

  makers(query) {
    const subquery = query
      .subQuery()
      .select([
        '"user"."id"',
        `("user"."firstName" || ' ' || "user"."lastName") AS "name"`,
        `sum("task"."claimedQuantity")::integer AS "claimedQuantity"`,
        `sum("task"."completedQuantity")::integer AS "completedQuantity"`,
      ])
      .from(User, 'user')
      .innerJoin(
        'user.tasks',
        'task',
        '"task"."workOrderId" = "workOrder"."id"',
      )
      .groupBy('"user"."id"')
      .orderBy({ '"user"."id"': 'DESC' });

    return query.addSelect(
      `(SELECT coalesce(json_agg(t.*), '[]') FROM (${subquery.getQuery()}) t) AS "makers"`,
    );
  },

  skills(query) {
    const subquery = query
      .subQuery()
      .select(['"skill"."id"', '"skill"."name"'])
      .from(Skill, 'skill')
      .innerJoin(
        'skill.workOrderSkills',
        'workOrderSkills',
        '"workOrderSkills"."workOrderId" = "workOrder"."id"',
      )
      .orderBy('"skill"."name"');

    return query.addSelect(
      `(SELECT coalesce(json_agg(t.*), '[]') FROM (${subquery.getQuery()}) t) AS "skills"`,
    );
  },

  quantityAvailable(query) {
    return query.addSelect(
      '"workOrder"."totalQuantity" - "workOrder"."completedQuantity" AS "availableQuantity"',
    );
  },
};

export const buildWorkOrderQuery = (params: WorkOrderQueryParams = {}) => {
  const repo = getRepository(WorkOrder);
  let query = repo.createQueryBuilder('workOrder').groupBy('"workOrder"."id"');

  if (params.select) {
    query = query.select([]);
    params.select.forEach((field) => {
      if (workOrderColumns.includes(field as typeof workOrderColumns[number])) {
        query = query.addSelect(`"workOrder"."${field}"`);
      } else {
        const selector = selectors[field as SelectorName];
        query = selector(query, params);
      }
    });
  }

  if (params.id) {
    query = query.andWhere('"workOrder"."id" = :id', { id: params.id });
  }

  if (params.active !== undefined) {
    const op = params.active ? '=' : '!=';
    query = query.andWhere(`"workOrder"."status" ${op} :status`, {
      status: WorkOrderStatus.active,
    });
  }

  let { status } = params;
  if (params.active === true) status = 'active';
  else if (params.active === false) status = 'inactive';

  if (status === 'active' || status === 'available') {
    query = query.andWhere('"workOrder"."status" = :status', {
      status: WorkOrderStatus.active,
    });
  } else if (status === 'inactive' && !params.user) {
    query = query.andWhere('"workOrder"."status" != :status', {
      status: WorkOrderStatus.active,
    });
  }

  if (params.user) {
    query = query
      .addSelect(
        `json_build_object(` +
          `'taskId', "task"."id",` +
          `'claimedQuantity', "task"."claimedQuantity",` +
          `'completedQuantity', "task"."completedQuantity"` +
          `) AS "userTaskDetails"`,
      )
      .addGroupBy('"task"."id"')
      .addOrderBy('"task"."id"', 'DESC');

    if (status === 'active') {
      query = query.innerJoin(
        'workOrder.tasks',
        'task',
        '"task"."status" = :taskStatus AND "task"."userId" = :userId',
        { taskStatus: TaskStatus.active, userId: params.user.id },
      );
    } else if (status === 'inactive') {
      query = query.innerJoin(
        'workOrder.tasks',
        'task',
        '"task"."status" != :taskStatus AND "task"."userId" = :userId',
        { taskStatus: TaskStatus.active, userId: params.user.id },
      );
    } else if (status === 'available') {
      query = query.andWhere('"workOrder"."podId" = :podId', {
        podId: params.user.podId,
      });

      query = query.andWhere(
        `
        NOT EXISTS (
          SELECT 1 FROM "workOrderSkills" ws
          WHERE ws."workOrderId" = "workOrder".id AND NOT EXISTS (
            SELECT 1 FROM "userSkills" us
            WHERE us."skillId" = ws."skillId" AND us."userId" = :userId
          )
        )`,
        { userId: params.user.id },
      );

      query = query.leftJoin(
        'workOrder.tasks',
        'task',
        '"task"."userId" = :userId',
        {
          userId: params.user.id,
        },
      );
    } else if (status === 'review') {
      query = query.innerJoin(
        'workOrder.tasks',
        'task',
        '"task"."userId" = :userId AND "task"."status" = :taskStatus',
        {
          userId: params.user.id,
          taskStatus: TaskStatus.inReview,
        },
      );
    } else {
      query = query.leftJoin(
        'workOrder.tasks',
        'task',
        '"task"."userId" = :userId',
        {
          userId: params.user.id,
        },
      );
    }
  }

  if (params.limit) query = query.limit(params.limit);
  if (params.offset) query = query.offset(params.offset);

  return query;
};
