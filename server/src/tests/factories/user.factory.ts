import { Factory } from 'fishery';
import { User } from 'app/user/user.model';
import { create } from 'tests/utils/create';
import { encryptPassword } from 'lib/password';

export const userFactory = Factory.define<User>(({ sequence, onCreate }) => {
  onCreate(async (params) => {
    return await create<User>('users', {
      ...params,
      password: params.password && (await encryptPassword(params.password)),
    });
  });

  const now = new Date();

  return {
    id: sequence,
    email: `email-${sequence}@mail.com`,
    password: 'password',
    firstName: 'First name',
    lastName: 'Last name',
    isActive: true,
    address1: 'Address 1',
    city: 'City',
    state: 'State',
    zip: '123',
    phone: '123',
    podId: 1,
    adminVerified: true,
    updatedAt: now,
    createdAt: now,
  };
});

export const currentUser = userFactory.build();
