import { Task, TaskStatus } from 'app/task/task.model';
import { getRepository, Not } from 'typeorm';
import { WorkOrder } from 'app/workOrder/workOrder.model';
import { ValidationError } from 'errors';

export const validateTask = async (task: Task) => {
  const repo = getRepository(Task);

  if (task.completedQuantity > task.claimedQuantity) {
    throw new Error('Completed quantity exceeded claimed quantity');
  }

  const workOrderRepo = getRepository(WorkOrder);
  const workOrder =
    task.workOrder || (await workOrderRepo.findOneOrFail(task.workOrderId));

  if (task.claimedQuantity < workOrder.minTaskQuantity) {
    throw new ValidationError(
      `Claimed quantity should be at least ${workOrder.minTaskQuantity}`,
    );
  }

  if (task.claimedQuantity > workOrder.maxTaskQuantity) {
    throw new ValidationError(
      `Claimed quantity should be at most ${workOrder.maxTaskQuantity}`,
    );
  }

  let claimedSumQuery = repo
    .createQueryBuilder('task')
    .select('SUM("claimedQuantity")', 'sum')
    .where('"workOrderId" = :workOrderId', {
      workOrderId: task.workOrderId,
    });

  if (task.id)
    claimedSumQuery = claimedSumQuery.andWhere('id != :taskId', {
      taskId: task.id,
    });

  const { sum } = await claimedSumQuery.getRawOne();
  const alreadyClaimedSum = parseInt(sum);

  if (task.claimedQuantity > workOrder.totalQuantity - alreadyClaimedSum) {
    throw new ValidationError('Claimed Quantity exceed available quantity');
  }

  if (task.status === TaskStatus.active) {
    const conditions: Record<string, unknown> = {
      userId: task.userId,
      status: TaskStatus.active,
    };

    if (task.id) conditions.id = Not(task.id);

    const activeTask = await repo.findOne(conditions);

    if (activeTask) {
      throw new ValidationError('User already has an Active task');
    }
  }
};
