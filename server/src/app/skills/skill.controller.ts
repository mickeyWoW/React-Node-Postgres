import { publicHandler } from 'lib/requestHandler';
import * as service from 'app/skills/skill.service';
import { number, object } from 'yup';

export const getSkills = publicHandler({}, async (req, res) => {
  res.json(await service.getSkills());
});

export const getSkillById = publicHandler(
  {
    params: object({
      id: number().required(),
    }),
  },
  async (req, res) => {
    res.json(await service.getSkillById(req.params.id));
  },
);
