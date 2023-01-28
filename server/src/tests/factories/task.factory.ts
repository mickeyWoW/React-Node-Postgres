import { Factory } from 'fishery';
import { Task, TaskStatus } from 'app/task/task.model';
import { create } from 'tests/utils/create';

export const taskFactory = Factory.define<Omit<Task, 'user' | 'workOrder'>>(
  ({ sequence, onCreate }) => {
    onCreate(async (params) => {
      return await create<Task>('tasks', params);
    });

    const now = new Date();

    return {
      id: sequence,
      userId: 1,
      workOrderId: 1,
      claimedQuantity: 10,
      status: TaskStatus.active,
      completedQuantity: 5,
      updatedAt: now,
      createdAt: now,
    };
  },
);
