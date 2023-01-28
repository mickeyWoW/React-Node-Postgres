import { Factory } from 'fishery';
import { Skill } from 'app/skills/skill.model';
import { create } from 'tests/utils/create';

export const skillFactory = Factory.define<Skill>(({ sequence, onCreate }) => {
  onCreate(async (params) => {
    return await create<Skill>('skills', params);
  });

  const now = new Date();

  return {
    id: sequence,
    name: `skill ${sequence}`,
    updatedAt: now,
    createdAt: now,
  };
});

export const skill1 = skillFactory.build();
export const skill2 = skillFactory.build();
