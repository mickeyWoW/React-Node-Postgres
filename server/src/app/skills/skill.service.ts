import { Skill } from 'app/skills/skill.model';
import { getRepository } from 'typeorm';

export const getSkillById = async (id: number) => {
  const repo = getRepository(Skill);
  return await repo.findOneOrFail(id);
};

export const getSkills = async () => {
  const repo = getRepository(Skill);
  return await repo.find({ order: { name: 'ASC' } });
};
