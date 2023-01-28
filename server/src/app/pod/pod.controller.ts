import { publicHandler } from 'lib/requestHandler';
import * as service from 'app/pod/pod.service';

export const getPods = publicHandler({}, async (req, res) => {
  res.json(await service.listPods());
});
