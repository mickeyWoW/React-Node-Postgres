import { publicHandler } from 'lib/requestHandler';
import * as service from 'app/workOrder/workOrder.service';
import { number, object } from 'yup';
import { ValidationError } from 'errors';
import { string } from 'lib/yup';
import { workOrderColumns } from 'app/workOrder/workOrder.model';
import { getWorkOrdersStatus } from 'app/workOrder/workOrder.repository';

export const getWorkOrderById = publicHandler(
  {
    params: object({
      id: number().required(),
    }),
  },
  async (req, res) => {
    const { id } = req.params;
    const workOrder = await service.getWorkOrderById(id, {
      select: [...workOrderColumns, 'quantityAvailable'],
    });
    res.json(workOrder);
  },
);

export const getWorkOrders = publicHandler(
  {
    query: object({
      status: string().oneOf(['active', 'inactive', 'available', 'review']),
      userId: number(),
      limit: number(),
      offset: number(),
    }),
  },
  async (req, res) => {
    const { query } = req;

    if (
      (query.status === 'inactive' ||
        query.status === 'available' ||
        query.status === 'review') &&
      !query.userId
    ) {
      throw new ValidationError('Please provide userId parameter');
    }

    const workOrders = await service.getWorkOrders({
      ...query,
      select: [...workOrderColumns, 'quantityAvailable'],
      status: query.status as getWorkOrdersStatus,
      limit: query.limit || 20,
    });
    res.json(workOrders);
  },
);
