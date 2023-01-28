import { publicHandler } from 'lib/requestHandler';
import { number, object } from 'yup';
import * as service from 'app/task/task.service';

export const createTask = publicHandler(
  {
    body: object({
      userId: number().required(),
      workOrderId: number().required(),
      claimedQuantity: number().positive().required(),
    }),
  },
  async (req, res) => {
    const result = await service.createTask(req.body);
    res.json(result);
  },
);

export const updateTaskById = publicHandler(
  {
    params: object({
      id: number().required(),
    }),
    body: object({
      completedQuantity: number(),
    }),
  },
  async (req, res) => {
    const id = req.params.id;
    const { workOrder, ...task } = await service.updateTaskById(id, req.body);
    res.json(task);
  },
);
