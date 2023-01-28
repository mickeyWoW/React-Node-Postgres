import { get, post } from 'lib/fetch';

export const workOrdersAPI = {
  async getWorkOrders() {
    type Result = {
      activeWorkOrders: {
        id: number;
        name: string;
        endDate: string;
        totalQuantity: number;
        completedQuantity: number;
        podName: string;
      }[];
      archivedWorkOrders: {
        id: number;
        name: string;
        endDate: string;
        totalQuantity: number;
        completedQuantity: number;
        podName: string;
      }[];
    };

    return await get<Result>('/api/admin/work-orders');
  },

  async getWorkOrder(id: number) {
    type Result = {
      id: number;
      name: string;
      productSku: string;
      podName: string;
      timeEstimateMin: number;
      timeEstimateMax: number;
      minTaskQuantity: number;
      maxTaskQuantity: number;
      createdAt: string;
      endDate: string;
      paymentTerms: number;
      totalQuantity: number;
      completedQuantity: number;
      instructionsPdfLink: string;
      instructionsVideoLink: string;
      postSignupInstructions: string;
      makers: {
        id: number;
        name: string;
        claimedQuantity: number;
        completedQuantity: number;
      }[];
    };

    return await get<Result>(`/api/admin/work-orders/${id}`);
  },

  async createWorkOrder(data: {
    podId: number;
    name: string;
    productSku: string;
    timeEstimateMin: number;
    timeEstimateMax: number;
    minTaskQuantity: number;
    maxTaskQuantity: number;
    endDate: Date;
    paymentTerms: number;
    paymentStatus: string;
    totalQuantity: number;
    completedQuantity: number;
    instructionsPdfLink: string;
    instructionsVideoLink: string;
    postSignupInstructions: string;
    skills: number[];
  }) {
    type Result = {
      id: number;
      podId: number;
      name: string;
      productSku: string;
      timeEstimateMin: number;
      timeEstimateMax: number;
      minTaskQuantity: number;
      maxTaskQuantity: number;
      endDate: string;
      paymentTerms: number;
      totalQuantity: number;
      completedQuantity: number;
      instructionsPdfLink: string;
      instructionsVideoLink: string;
      postSignupInstructions: string;
      updatedAt: string;
      createdAt: string;
      skills: {
        id: number;
        name: string;
      }[];
    };

    return await post<Result>('/api/admin/work-orders', { data });
  },
};
