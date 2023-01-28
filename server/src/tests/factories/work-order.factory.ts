import { Factory } from 'fishery';
import { WorkOrder } from 'app/workOrder/workOrder.model';
import { create } from 'tests/utils/create';

export const workOrderFactory = Factory.define<WorkOrder>(
  ({ sequence, onCreate }) => {
    onCreate(async (params) => {
      return await create<WorkOrder>('workOrders', params);
    });

    const now = new Date();
    const endDate = new Date(now.setDate(now.getDate() + 1));

    return {
      id: sequence,
      podId: 1,
      name: `work order ${sequence}`,
      productSku: `sku ${sequence}`,
      timeEstimateMin: 0,
      timeEstimateMax: 10,
      minTaskQuantity: 0,
      maxTaskQuantity: 10,
      endDate,
      status: 'active',
      paymentTerms: 1,
      paymentStatus: 'payment status',
      totalQuantity: 10,
      completedQuantity: 0,
      instructionsPdfLink: 'instructions pdf link',
      instructionsVideoLink: 'instructions video link',
      postSignupInstructions: 'post sign up instructions',
      updatedAt: now,
      createdAt: now,
    };
  },
);

export const workOrder1 = workOrderFactory.build({ podId: 1 });
export const workOrder2 = workOrderFactory.build({ podId: 1 });
export const workOrder3 = workOrderFactory.build({ podId: 2 });
export const workOrders = [workOrder1, workOrder2, workOrder3];
