import { useQuery } from 'react-query';
import { skillsAPI } from 'components/Skills/api';

export const useSkills = () => useQuery('/skills', skillsAPI.getSkills);
