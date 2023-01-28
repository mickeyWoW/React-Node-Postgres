import dayjs from 'dayjs';
import { useMutation, useQuery } from 'react-query';
import { workOrdersAPI } from 'components/WorkOrders/api';
import history from 'lib/history';
import routes from 'routes';
import { toast } from 'react-toastify';

export const formatWorkOrderName = (item?: { name: string; endDate: string }) =>
  item ? `${item.name} (${dayjs(item.endDate).format('M/D/YY')})` : 'N/A';

export const useWorkOrdersQuery = () =>
  useQuery('/work-orders', workOrdersAPI.getWorkOrders);

export const useWorkOrderQuery = (id: number) =>
  useQuery(`/work-orders/${id}`, () => workOrdersAPI.getWorkOrder(id));

export const useCreateWorkOrderQuery = () => {
  const { mutate: createWorkOrder, error } = useMutation(
    workOrdersAPI.createWorkOrder,
    {
      onSuccess() {
        history.push(routes.workOrders.index);
        toast.info('Work Order created successfully');
      },
    },
  );

  return { createWorkOrder, error };
};
