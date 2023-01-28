import { adminHandler } from 'lib/requestHandler';
import * as service from 'app/workOrder/workOrder.service';
import { array, date, number, object, string } from 'lib/yup';

export const getWorkOrders = adminHandler({}, async (req, res) => {
  const select = [
    'id',
    'name',
    'podName',
    'endDate',
    'totalQuantity',
    'completedQuantity',
    'podName',
  ] as const;

  const result = await service.getActiveAndArchivedWorkOrders({ select });
  res.json(result);
});

export const getWorkOrderById = adminHandler(
  {
    params: object({
      id: number().required(),
    }),
  },
  async (req, res) => {
    const workOrder = await service.getWorkOrderById(req.params.id, {
      select: [
        'id',
        'name',
        'podName',
        'endDate',
        'totalQuantity',
        'completedQuantity',
        'productSku',
        'timeEstimateMin',
        'timeEstimateMax',
        'minTaskQuantity',
        'maxTaskQuantity',
        'createdAt',
        'paymentTerms',
        'instructionsPdfLink',
        'instructionsVideoLink',
        'postSignupInstructions',
        'makers',
      ],
    });

    res.json(workOrder);
  },
);

export const createWorkOrder = adminHandler(
  {
    body: object({
      name: string().required(),
      productSku: string().required(),
      podId: number().required(),
      minTaskQuantity: number().required(),
      maxTaskQuantity: number().required(),
      timeEstimateMin: number().required(),
      timeEstimateMax: number().required(),
      endDate: date().required(),
      paymentTerms: number().required(),
      paymentStatus: string().required(),
      totalQuantity: number().required(),
      instructionsPdfLink: string().required(),
      instructionsVideoLink: string().required(),
      postSignupInstructions: string().required(),
      skills: array().of(number().required()),
    }),
  },
  async (req, res) => {
    const workOrder = await service.createWorkOrder(req.body);
    res.json(workOrder);
  },
);
