import { getPublic } from 'tests/utils/request';
import { podSchema } from 'tests/utils/schemas';
import { array } from 'lib/yup';

describe('pod endpoints', () => {
  describe('GET /pods', () => {
    it('should return all pods', async () => {
      await getPublic('/pods', { schema: array().of(podSchema.required()) });
    });
  });
});
