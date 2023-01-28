import { Pod } from 'app/pod/pod.model';
import { getRepository } from 'typeorm';
import { NotFoundError } from 'errors';
import { WorkOrder, WorkOrderStatus } from 'app/workOrder/workOrder.model';
import { User } from 'app/user/user.model';
import { selectActiveWorkOrder } from 'app/user/user.service';

type Options = {
  id?: number;
  selectActiveWorkOrdersCount?: boolean;
  selectActiveWorkOrders?: boolean;
  selectMakers?: boolean;
};

export const listPods = async ({
  id,
  selectActiveWorkOrdersCount,
  selectActiveWorkOrders,
  selectMakers,
}: Options = {}): Promise<Pod[]> => {
  const repo = getRepository(Pod);
  let query = repo
    .createQueryBuilder('pod')
    .select(['pod.id AS id', 'pod.name AS name'])
    .groupBy('pod.id');

  if (id) query = query.andWhere('pod.id = :id', { id });

  if (selectActiveWorkOrders || selectActiveWorkOrdersCount) {
    if (selectActiveWorkOrders) {
      const subquery = query
        .subQuery()
        .select(['id', 'name', '"totalQuantity"', '"completedQuantity"'])
        .from(WorkOrder, 'workOrder')
        .where('"podId" = pod.id AND status = :status', {
          status: WorkOrderStatus.active,
        })
        .getQuery();

      query = query.addSelect([
        `(SELECT coalesce(json_agg(t.*), '[]') FROM (${subquery}) t) AS "activeWorkOrders"`,
      ]);
    } else {
      query = query
        .addSelect([
          'count("activeWorkOrders".*)::integer AS "activeWorkOrdersCount"',
        ])
        .leftJoin(
          'pod.workOrders',
          'activeWorkOrders',
          '"activeWorkOrders"."status" = :status',
          {
            status: WorkOrderStatus.active,
          },
        );
    }
  }

  if (selectMakers) {
    let makersSubquery = query
      .subQuery()
      .select([
        '"user"."id"',
        `"user"."firstName" || ' ' || "user"."lastName" AS "name"`,
      ])
      .from(User, 'user')
      .where('"podId" = pod.id');

    makersSubquery = selectActiveWorkOrder(makersSubquery);

    query = query.addSelect([
      `(SELECT coalesce(json_agg(t.*), '[]') FROM (${makersSubquery.getQuery()}) t) AS "makers"`,
    ]);
  }

  return await query.getRawMany();
};

export const getPodById = async (
  id: number,
  options: Options = {},
): Promise<Pod> => {
  const [pod] = await listPods({ ...options, id });
  if (!pod) throw new NotFoundError(`Pod with id ${id} is not found`);
  return pod;
};

export const createPod = async (params: Pick<Pod, 'name'>) => {
  const repo = getRepository(Pod);
  const pod = repo.create(params);
  return await repo.save(pod);
};
