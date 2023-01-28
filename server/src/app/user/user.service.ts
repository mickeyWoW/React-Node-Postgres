import { User, userColumns } from 'app/user/user.model';
import { getRepository, In, SelectQueryBuilder } from 'typeorm';
import bcrypt from 'bcrypt';
import { Skill } from 'app/skills/skill.model';
import dayjs from 'dayjs';
import { NotFoundError, ValidationError } from 'errors';
import { WorkOrder, WorkOrderStatus } from 'app/workOrder/workOrder.model';
import { Pod } from 'app/pod/pod.model';
import { Task } from 'app/task/task.model';
import { encryptPassword } from 'lib/password';
import { createToken } from 'jwt';
import randomatic from 'randomatic';
import * as mailer from 'app/user/user.mailer';

export const register = async ({
  password,
  skills: skillIds,
  ...body
}: Partial<Omit<User, 'password' | 'skills'>> & {
  password: string;
  skills: number[];
}) => {
  const userRepository = getRepository(User);
  const user = userRepository.create({
    ...body,
    password: await encryptPassword(password),
  });

  const skillRepo = getRepository(Skill);
  const skills = await skillRepo.find({
    where: { id: In(skillIds) },
    select: ['id', 'name'],
  });
  user.skills = skills;

  const missingId = skillIds.find(
    (id) => !skills.some((skill) => skill.id === id),
  );
  if (missingId) {
    throw new ValidationError(`Skill with id ${missingId} is not found`);
  }

  try {
    await userRepository.save(user);
  } catch (error) {
    throw new ValidationError('User with such email already exists');
  }

  delete user.password;

  return {
    token: createToken({ id: user.id, type: 'user' }),
    user,
  };
};

export const updateUser = async ({
  id,
  skillIds,
  ...body
}: Partial<User> & {
  id: User['id'];
  skillIds?: number[];
}) => {
  const repo = getRepository(User);
  const user = await repo.findOneOrFail(id, {
    relations: ['skills'],
  });

  if (body.password) {
    body.password = await encryptPassword(body.password);
  }

  if (skillIds) {
    const skillRepo = getRepository(Skill);
    user.skills = await skillRepo.findByIds(skillIds);
  }

  Object.assign(user, body);
  await repo.save(user);
  return {
    ...user,
    skills: user.skills!.map(({ id, name }) => ({ id, name })),
  };
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const repo = getRepository(User);
  const user = await repo.findOne({ email }, { relations: ['skills'] });
  if (!user) throw new ValidationError('Email is not registered');

  if (!(await bcrypt.compare(password, user.password as string)))
    throw new ValidationError('Invalid password');

  delete user.password;
  return {
    user: {
      ...user,
      skills: user.skills!.map(({ id, name }) => ({ id, name })),
    },
    token: createToken({ id: user.id, type: 'user' }),
  };
};

export const sendResetPasswordEmail = async ({ email }: { email: string }) => {
  const repo = getRepository(User);
  const user = await repo.findOne({ email });
  if (!user) throw new NotFoundError('Email is not registered');

  user.resetPasswordToken = randomatic('00000');
  user.resetPasswordExpiresAt = dayjs().add(10, 'm').toDate();

  await repo.save(user);

  mailer.sendResetPasswordEmail({
    to: user.email,
    token: user.resetPasswordToken,
  });
};

export const resetPassword = async ({
  code,
  password,
}: {
  code: string;
  password: string;
}) => {
  const repo = getRepository(User);
  const user = await repo.findOne({
    resetPasswordToken: code,
  });

  if (!user) throw new ValidationError('Code is invalid');

  if (!user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date())
    throw new ValidationError('Code is expired');

  user.resetPasswordToken = (null as unknown) as undefined;
  user.resetPasswordExpiresAt = (null as unknown) as undefined;
  user.password = await encryptPassword(password);

  return repo.save(user);
};

type Options = {
  id?: number;
  select?: readonly (
    | typeof userColumns[number]
    | 'name'
    | 'address'
    | 'podName'
    | 'activeWorkOrder'
    | 'onTimeCompletionPercentage'
    | 'totalUnitsCompleted'
    | 'totalTasksCompleted'
    | 'activeTask'
    | 'pastTasks'
    | 'skills'
  )[];
  limit?: number;
  offset?: number;
};

export const getUserById = async (id: number, options: Options = {}) => {
  const [user] = await buildUsersQuery({ id, ...options }).getRawMany();
  if (!user) throw new NotFoundError(`User is not found`);
  return user;
};

export const buildUsersQuery = ({
  id,
  select = userColumns,
  limit,
  offset,
}: Options = {}) => {
  const repo = getRepository(User);
  let query = repo
    .createQueryBuilder('user')
    .orderBy({ '"user"."id"': 'DESC' })
    .groupBy('"user"."id"');

  if (id) query = query.andWhere('"user"."id" = :id', { id: id });

  if (select) {
    query = query.select([]);
    let joinedTask = false;

    select.forEach((field) => {
      if (userColumns.includes(field as typeof userColumns[number])) {
        query = query.addSelect(`"user"."${field}"`);
      } else if (field === 'skills') {
        const subquery = query
          .subQuery()
          .select(['"skill"."id"', '"skill"."name"'])
          .from(Skill, 'skill')
          .innerJoin(
            'skill.userSkills',
            'userSkill',
            '"userSkill"."userId" = "user"."id"',
          )
          .orderBy({ '"skill"."name"': 'ASC' });

        query = query.addSelect(
          `(SELECT coalesce(json_agg(t.*), '[]') FROM (${subquery.getQuery()}) t) AS "skills"`,
        );
      } else if (field === 'name') {
        query = query.addSelect(
          `"user"."firstName" || ' ' || "user"."lastName" AS "name"`,
        );
      } else if (field === 'address') {
        query = query.addSelect([
          `concat_ws(' ', "user"."address1", "user"."address2") AS "address"`,
        ]);
      } else if (field === 'podName') {
        const subquery = query
          .subQuery()
          .select(['"pod"."name"'])
          .from(Pod, 'pod')
          .where('"pod"."id" = "user"."podId"');

        query = query.addSelect([`(${subquery.getQuery()}) as "podName"`]);
      } else if (field === 'activeWorkOrder') {
        query = selectActiveWorkOrder(query);
      } else if (
        field === 'onTimeCompletionPercentage' ||
        field === 'totalUnitsCompleted' ||
        field === 'totalTasksCompleted'
      ) {
        if (!joinedTask) {
          joinedTask = true;
          query = query.leftJoin(
            'user.tasks',
            'task',
            `"task"."claimedQuantity" = "task"."completedQuantity"`,
          );
        }

        if (field === 'onTimeCompletionPercentage') {
          query = query.addSelect([
            '(' +
              'count("task".*) FILTER (WHERE "task"."completedOnTime") * 100 ' +
              '/ coalesce(nullif(count("task".*), 0), 1)' +
              ')::integer AS "onTimeCompletionPercentage"',
          ]);
        } else if (field === 'totalUnitsCompleted') {
          query = query.addSelect(
            `coalesce(sum("task"."completedQuantity"), 0)::integer "totalUnitsCompleted"`,
          );
        } else if (field === 'totalTasksCompleted') {
          query = query.addSelect(
            `count("task".*)::integer "totalTasksCompleted"`,
          );
        }
      } else if (field === 'activeTask') {
        const subquery = query
          .subQuery()
          .select([
            '"workOrder"."id" AS "workOrderId"',
            '"workOrder"."name" AS "taskName"',
            '"task"."claimedQuantity"',
            '"task"."completedQuantity"',
            '"workOrder"."endDate" AS "targetEndDate"',
          ])
          .from(Task, 'task')
          .innerJoin(
            'task.workOrder',
            'workOrder',
            '"workOrder"."status" = :status',
            {
              status: WorkOrderStatus.active,
            },
          )
          .where(
            '"task"."userId" = "user"."id" AND "task"."claimedQuantity" != "task"."completedQuantity"',
          )
          .limit(1);

        query = query.addSelect(
          `(SELECT row_to_json(t.*) FROM (${subquery.getQuery()}) t) AS "activeTask"`,
        );
      } else if (field === 'pastTasks') {
        const subquery = query
          .subQuery()
          .select([
            '"workOrder"."id" AS "workOrderId"',
            '"workOrder"."name" AS "taskName"',
            '"task"."claimedQuantity"',
            '"task"."completedQuantity"',
            '"task"."completedOnTime"',
          ])
          .from(Task, 'task')
          .innerJoin('task.workOrder', 'workOrder')
          .where(
            '"workOrder"."status" != :status OR "task"."claimedQuantity" = "task"."completedQuantity"',
            {
              status: WorkOrderStatus.active,
            },
          )
          .orderBy({ '"task"."id"': 'DESC' });

        query = query.addSelect(
          `(SELECT coalesce(json_agg(t.*), '[]') FROM (${subquery.getQuery()}) t) AS "pastTasks"`,
        );
      }
    });
  }

  if (limit !== undefined) query = query.limit(limit);

  if (offset !== undefined) query = query.offset(offset);

  return query;
};

export const selectActiveWorkOrder = (query: SelectQueryBuilder<User>) => {
  const activeWorkOrderSubquery = query
    .subQuery()
    .select(['name', '"endDate"'])
    .from(WorkOrder, 'workOrder')
    .innerJoin('workOrder.tasks', 'task', '"task"."userId" = "user"."id"')
    .where('workOrder.status = :status', {
      status: WorkOrderStatus.active,
    })
    .limit(1)
    .getQuery();

  query = query.addSelect([
    `(SELECT row_to_json(t.*) FROM (${activeWorkOrderSubquery}) t) AS "activeWorkOrder"`,
  ]);

  return query;
};
