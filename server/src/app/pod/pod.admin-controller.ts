import { adminHandler } from 'lib/requestHandler';
import * as service from 'app/pod/pod.service';
import { object, string, number } from 'lib/yup';

export const getPods = adminHandler({}, async (req, res) => {
  const pods = await service.listPods({ selectActiveWorkOrdersCount: true });
  res.json(pods);
});

export const getPodById = adminHandler(
  {
    params: object({
      id: number().required(),
    }),
  },
  async (req, res) => {
    const pod = await service.getPodById(req.params.id, {
      selectActiveWorkOrders: true,
      selectMakers: true,
    });
    res.json(pod);
  },
);

export const createPod = adminHandler(
  {
    body: object({
      name: string().required(),
    }),
  },
  async (req, res) => {
    const pod = await service.createPod(req.body);
    res.json(pod);
  },
);
