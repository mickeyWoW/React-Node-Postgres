import { useMutation, useQuery } from 'react-query';
import { podsAPI } from 'components/Pods/api';
import history from 'lib/history';
import routes from 'routes';
import { toast } from 'react-toastify';

export const usePodsQuery = () => {
  return useQuery('/pods', podsAPI.getPods);
};

export const usePodQuery = (id: number) => {
  return useQuery(`/pods/${id}`, () => podsAPI.getPod(id));
};

export const useCreatePodQuery = () => {
  const { mutate: createPod, error } = useMutation(podsAPI.createPod, {
    onSuccess() {
      history.push(routes.pods.index);
      toast.info('Pod created successfully');
    },
  });

  return { createPod, error };
};
