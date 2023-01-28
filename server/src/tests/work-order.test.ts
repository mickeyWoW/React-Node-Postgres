import { get, getPublic } from 'tests/utils/request';
import { pod1 } from 'tests/factories/pod.factory';
import { workOrderSchema } from 'tests/utils/schemas';
import { array } from 'lib/yup';
import {
  workOrder1,
  workOrder2,
  workOrder3,
  workOrders,
} from 'tests/factories/work-order.factory';
import { currentUser, userFactory } from 'tests/factories/user.factory';
import { taskFactory } from 'tests/factories/task.factory';

describe('work order endpoints', () => {
  describe('GET /work-orders?podId=:pod-id', () => {
    it('should return all work orders by pod id', async () => {
      const { data } = await get(`/work-orders?podId=${pod1.id}`, {
        schema: array().of(workOrderSchema.required()),
      });
      expect(data.length).toBe(
        workOrders.reduce(
          (sum, workOrder) => sum + (workOrder.podId === pod1.id ? 1 : 0),
          0,
        ),
      );
    });
  });

  // describe('GET /work-orders?userId=:user-id&active=true', () => {
  //   it('should return active work orders for user', async () => {
  //     const otherUser = await userFactory.create();
  //
  //     // work order 1 has active and inactive task for current user
  //     await taskFactory.create({
  //       active: true,
  //       userId: currentUser.id,
  //       workOrderId: workOrder1.id,
  //     });
  //     await taskFactory.create({
  //       active: false,
  //       userId: currentUser.id,
  //       workOrderId: workOrder1.id,
  //     });
  //
  //     // work order 2 has active task for other user
  //     await taskFactory.create({
  //       active: true,
  //       userId: otherUser.id,
  //       workOrderId: workOrder2.id,
  //     });
  //
  //     // work order task has inactive task for current user
  //     await taskFactory.create({
  //       active: false,
  //       userId: otherUser.id,
  //       workOrderId: workOrder3.id,
  //     });
  //
  //     const { data } = await get(
  //       `/work-orders?userId=${currentUser.id}&active=true`,
  //       {
  //         schema: array().of(workOrderSchema.required()),
  //       },
  //     );
  //
  //     expect(data.length).toBe(1);
  //     expect(data[0].name).toBe(workOrder1.name);
  //   });
  // });

  describe('GET /work-orders/:work-order-id', () => {
    it('should return work order by id', async () => {
      await getPublic(`/work-orders/${workOrder1.id}`, {
        schema: workOrderSchema,
      });
    });
  });
});
