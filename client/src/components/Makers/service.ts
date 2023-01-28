import { useQuery } from 'react-query';
import { makersApi } from 'components/Makers/api';

export const useMakersQuery = () => {
  return useQuery('/makers', makersApi.getMakers);
};

export const useMakerQuery = (id: number) => {
  return useQuery(`/makers/${id}`, () => makersApi.getMaker(id));
};
