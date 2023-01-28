import { get } from 'lib/fetch';

export const makersApi = {
  async getMakers() {
    type Result = {
      id: number;
      name: string;
      podName: string;
      activeWorkOrder: {
        name: string;
        endDate: string;
      };
      onTimeCompletionPercentage: number;
    }[];

    return await get<Result>('/api/admin/makers');
  },

  async getMaker(id: number) {
    type Result = {
      id: number;
      name: string;
      podName: string;
      address: string;
      phone: string;
      email: string;
      createdAt: string;
      onTimeCompletionPercentage: number;
      totalUnitsCompleted: number;
      totalTasksCompleted: number;
      activeTask?: {
        workOrderId: number;
        taskName: string;
        claimedQuantity: number;
        completedQuantity: number;
        targetEndDate: string;
      };
      pastTasks: {
        workOrderId: number;
        taskName: string;
        claimedQuantity: number;
        completedQuantity: number;
        completedOnTime: string;
      }[];
    };

    return await get<Result>(`/api/admin/makers/${id}`);
  },
};
