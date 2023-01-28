import { getRepository } from 'typeorm';
import { WorkOrder, WorkOrderStatus } from 'app/workOrder/workOrder.model';
import { Task, TaskStatus } from 'app/task/task.model';
import { validateTask } from 'app/task/task.validation';
import dayjs from 'dayjs';
import { NotFoundError, ValidationError } from 'errors';
import { runInTransaction } from 'lib/runInTransaction';

export const createTask = async ({
  userId,
  workOrderId,
  claimedQuantity,
}: {
  userId: number;
  workOrderId: number;
  claimedQuantity: number;
}): Promise<Task> => {
  const repo = getRepository(Task);

  const task = repo.create({
    userId,
    workOrderId,
    claimedQuantity,
    completedQuantity: 0,
    completedOnTime: false,
    status: TaskStatus.active,
  });

  await validateTask(task);

  return await repo.save(task);
};

export const updateTaskById = async (
  id: number,
  {
    completedQuantity,
  }: {
    completedQuantity?: number;
  },
) => {
  const repo = getRepository(Task);

  const task = await repo.findOne(id, {
    relations: ['workOrder'],
  });

  if (!task) throw new NotFoundError('Task is not found');

  if (task.status !== TaskStatus.active)
    throw new ValidationError(
      `Can update only active task, this task has ${task.status} status`,
    );

  if (completedQuantity !== undefined) {
    task.completedQuantity = completedQuantity;
    if (task.completedQuantity === task.claimedQuantity) {
      task.status = TaskStatus.inReview;
      task.completedOnTime =
        new Date() < dayjs(task.workOrder.endDate).add(1, 'd').toDate();
    }
  }

  await validateTask(task);
  await repo.save(task);

  const { sum: orderCompletedQuantity } = await repo
    .createQueryBuilder('task')
    .select('SUM("completedQuantity")', 'sum')
    .where({
      workOrderId: task.workOrderId,
    })
    .getRawOne();

  const workOrderRepo = getRepository(WorkOrder);
  const { workOrder } = task;

  const workOrderParams: Partial<WorkOrder> = {
    completedQuantity: orderCompletedQuantity,
  };
  if (orderCompletedQuantity < workOrder.totalQuantity) {
    workOrderParams.status = WorkOrderStatus.active;
  } else {
    workOrderParams.status = WorkOrderStatus.complete;
  }

  await workOrderRepo.update({ id: task.workOrderId }, workOrderParams);

  return task;
};

export const getTasks = async ({ ...params }: { status?: string } = {}) => {
  const repo = getRepository(Task);

  if (!params.status) delete params.status;

  return await repo.find({
    where: params,
    relations: ['user', 'workOrder'],
  });
};

export const updateStatusByID = async (id: number, status: TaskStatus) => {
  const repo = getRepository(Task);

  const task = await repo.findOne(id, { relations: ['workOrder'] });

  if (!task) throw new NotFoundError('Task is not found');

  if (task.status === TaskStatus.inReview && status === TaskStatus.active) {
    task.completedQuantity = 0;
  }

  task.status = status;

  await runInTransaction(async (queryRunner) => {
    await queryRunner.manager.save(task);

    if (
      task.status === TaskStatus.active &&
      task.workOrder.status !== WorkOrderStatus.active
    ) {
      task.workOrder.status = WorkOrderStatus.active;
      await queryRunner.manager.save(task.workOrder);
    }
  });

  return task;
};
