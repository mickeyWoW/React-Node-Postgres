import { Factory } from 'fishery';
import { Pod } from 'app/pod/pod.model';
import { create } from 'tests/utils/create';

export const podFactory = Factory.define<Pod>(({ sequence, onCreate }) => {
  onCreate(async (params) => {
    return await create<Pod>('pods', params);
  });

  const now = new Date();

  return {
    id: sequence,
    name: `pod ${sequence}`,
    updatedAt: now,
    createdAt: now,
  };
});

export const pod1 = podFactory.build();
export const pod2 = podFactory.build();
