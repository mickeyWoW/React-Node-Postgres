import { get, post } from 'lib/fetch';

export const podsAPI = {
  async getPods() {
    type Result = {
      id: number;
      name: string;
      activeWorkOrdersCount: number;
    }[];

    return await get<Result>('/api/admin/pods');
  },

  async getPod(id: number) {
    type Result = {
      id: number;
      name: string;
      activeWorkOrders: {
        id: number;
        name: string;
        totalQuantity: number;
        completedQuantity: number;
      }[];
      makers: {
        id: number;
        name: string;
        activeWorkOrder?: {
          name: string;
          endDate: string;
        };
      }[];
    };

    return await get<Result>(`/api/admin/pods/${id}`);
  },

  async createPod(data: { name: string }) {
    type Result = {
      id: number;
      name: string;
    };

    return await post<Result>('/api/admin/pods', { data });
  },
};
