import { useMutation, useQuery } from 'react-query';
import { tasksAPI } from 'components/Tasks/api';
import { toast } from 'react-toastify';
import { queryClient } from 'lib/queryClient';

const tasksInReviewKey = ['/tasks', { status: 'review' }];

export const useInReviewTasksQuery = () => {
  return useQuery(tasksInReviewKey, tasksAPI.getInReviewTasks);
};

export const useUpdateTaskStatusQuery = () => {
  const { mutate: updateTask, error } = useMutation(tasksAPI.updateTask, {
    onSuccess() {
      queryClient.invalidateQueries(tasksInReviewKey);
      toast.info('Update Success!');
    },
  });

  return { updateTask, error };
};
