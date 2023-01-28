import { patchPublic, postPublic } from 'tests/utils/request';
import { currentUser, userFactory } from 'tests/factories/user.factory';
import {
  workOrder1,
  workOrder2,
  workOrderFactory,
} from 'tests/factories/work-order.factory';
import { taskSchema } from 'tests/utils/schemas';
import { taskFactory } from 'tests/factories/task.factory';
import { getRepository } from 'typeorm';
import { WorkOrder } from 'app/workOrder/workOrder.model';

describe('task endpoints', () => {
  describe('POST /tasks', () => {
    it('should create a task', async () => {
      await postPublic('/tasks', {
        body: {
          userId: currentUser.id,
          workOrderId: workOrder1.id,
          claimedQuantity: workOrder1.totalQuantity,
        },
        schema: taskSchema,
      });
    });

    it('should not create task if work order already has maximum tasks specified by field maxTaskQuantity', async () => {
      const workOrder = await workOrderFactory.create({ maxTaskQuantity: 1 });
      const otherUser = await userFactory.create();
      await taskFactory.create({
        workOrderId: workOrder.id,
        userId: otherUser.id,
      });

      const { data } = await postPublic('/tasks', {
        body: {
          userId: currentUser.id,
          workOrderId: workOrder.id,
          claimedQuantity: workOrder1.totalQuantity,
        },
      });

      expect(data.error).toBe('Work order already has maximum amount of tasks');
    });

    it('should fail if claimedQuantity of new task > workOrder.totalQuantity - sum(otherTasks.claimedQuantity)', async () => {
      const workOrder = await workOrderFactory.create({ totalQuantity: 5 });
      const user1 = await userFactory.create();
      const user2 = await userFactory.create();
      await taskFactory.create({
        workOrderId: workOrder.id,
        userId: user1.id,
        claimedQuantity: 1,
      });
      await taskFactory.create({
        workOrderId: workOrder.id,
        userId: user2.id,
        claimedQuantity: 2,
      });

      const { data } = await postPublic('/tasks', {
        body: {
          userId: currentUser.id,
          workOrderId: workOrder.id,
          claimedQuantity: 3,
        },
      });

      expect(data.error).toBe('Claimed Quantity exceed available quantity');
    });

    it('should fail if user already has active task', async () => {
      await taskFactory.create({
        userId: currentUser.id,
        workOrderId: workOrder1.id,
        claimedQuantity: 1,
      });

      const { data } = await postPublic('/tasks', {
        body: {
          userId: currentUser.id,
          workOrderId: workOrder1.id,
          claimedQuantity: 1,
        },
      });

      expect(data.error).toBe('User already has an Active task');
    });
  });

  describe('PATCH /tasks/:task-id', () => {
    it('should update task and work order completedQuantity', async () => {
      const workOrder = await workOrderFactory.create({
        completedQuantity: 0,
      });
      const task = await taskFactory.create({
        claimedQuantity: 1,
        workOrderId: workOrder.id,
      });

      const { data } = await patchPublic(`/tasks/${task.id}`, {
        body: {
          completedQuantity: 1,
        },
      });

      expect(data.completedQuantity).toBe(1);

      const workOrderRepo = getRepository(WorkOrder);
      const updatedWorkOrder = await workOrderRepo.findOneOrFail({
        id: workOrder.id,
      });
      expect(updatedWorkOrder.completedQuantity).toBe(1);
    });

    it('should fail if completedQuantity exceeds claimedQuantity', async () => {
      const task = await taskFactory.create({
        claimedQuantity: 1,
      });

      const { data } = await patchPublic(`/tasks/${task.id}`, {
        body: {
          completedQuantity: 2,
        },
      });

      expect(data.error).toBe('Completed quantity exceeded claimed quantity');
    });
  });
});
