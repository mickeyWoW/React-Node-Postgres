import { adminHandler } from 'lib/requestHandler';
import { number, object, string } from 'yup';
import * as service from 'app/task/task.service';
import { TaskStatus } from 'app/task/task.model';

export const getTasks = adminHandler(
  {
    query: object({
      status: string(),
    }),
  },
  async (req, res) => {
    const tasks = await service.getTasks({
      status: req.query.status as TaskStatus,
    });
    res.json(tasks);
  },
);

export const updateTaskById = adminHandler(
  {
    params: object({
      id: number().required(),
    }),
    body: object({
      status: string().oneOf([
        TaskStatus.active,
        TaskStatus.approved,
        TaskStatus.rejected,
      ]),
    }),
  },
  async (req, res) => {
    const task = await service.updateStatusByID(
      req.params.id,
      req.body.status as TaskStatus,
    );
    res.json(task);
  },
);
