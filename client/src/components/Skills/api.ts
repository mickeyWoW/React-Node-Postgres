import { get } from 'lib/fetch';

export const skillsAPI = {
  async getSkills() {
    type Result = {
      id: number;
      name: string;
      updatedAt: string;
      createdAt: string;
    }[];

    return await get<Result>('/skills');
  },
};
