import { get, patch } from 'lib/fetch';

export const tasksAPI = {
  async getInReviewTasks() {
    type Result = {
      id: number;
      user: {
        id: number;
        firstName: string;
        lastName: string;
      };
      workOrder: {
        id: number;
        name: string;
        endDate: string;
        timeEstimateMax: number;
      };
      completedQuantity: number;
    }[];

    return await get<Result>(`/api/admin/tasks`, {
      query: { status: 'In Review' },
    });
  },

  async updateTask({ id, ...data }: { id: number; status: string }) {
    await patch(`/api/admin/tasks/${id}`, { data });
  },
};
