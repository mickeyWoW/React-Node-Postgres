import {
  WorkOrder,
  workOrderColumns,
  WorkOrderStatus,
} from 'app/workOrder/workOrder.model';
import { getRepository } from 'typeorm';
import { WorkOrderSkill } from 'app/workOrderSkills/workOrderSkill.model';
import * as userService from 'app/user/user.service';
import { NotFoundError, ValidationError } from 'errors';
import {
  buildWorkOrderQuery,
  WorkOrderQueryParams,
} from 'app/workOrder/workOrder.repository';

export const getWorkOrderById = async (
  id: number,
  params: WorkOrderQueryParams,
): Promise<WorkOrder> => {
  const item = await buildWorkOrderQuery({ id, ...params }).getRawOne();
  if (!item) throw new NotFoundError();
  return item;
};

export const getWorkOrders = async ({
  ...params
}: WorkOrderQueryParams & { userId?: number }) => {
  if (params.userId) {
    const user = await userService.getUserById(params.userId);
    if (!user)
      throw new ValidationError(`User with id ${params.userId} does not exist`);

    params.user = user;
  }

  const query = buildWorkOrderQuery(params);
  return await query.getRawMany();
};

export const createWorkOrder = async (
  params: Omit<Partial<WorkOrder>, 'skills'> & { skills?: number[] },
): Promise<WorkOrder> => {
  const repo = getRepository(WorkOrder);
  const workOrder = repo.create({
    ...params,
    status: WorkOrderStatus.active,
    completedQuantity: 0,
  });

  if (params.skills) {
    workOrder.workOrderSkills = params.skills.map((skill) => {
      const workOrderSkill = new WorkOrderSkill();
      workOrderSkill.skillId = skill;
      return workOrderSkill;
    });
  }

  await repo.save(workOrder);

  const workOrders = await buildWorkOrderQuery({
    id: workOrder.id,
    select: [...workOrderColumns, 'skills'],
  }).getRawMany();

  return workOrders[0];
};

export const getActiveAndArchivedWorkOrders = async (
  params: WorkOrderQueryParams,
) => {
  const activeWorkOrdersQuery = buildWorkOrderQuery({
    ...params,
    active: true,
  });
  const archivedWorkOrdersQuery = buildWorkOrderQuery({
    ...params,
    active: false,
  });

  const [activeWorkOrders, archivedWorkOrders] = await Promise.all([
    activeWorkOrdersQuery.getRawMany(),
    archivedWorkOrdersQuery.getRawMany(),
  ]);

  return {
    activeWorkOrders,
    archivedWorkOrders,
  };
};
