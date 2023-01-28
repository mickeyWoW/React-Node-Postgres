import { get, patch, postPublic } from 'tests/utils/request';
import { object, string } from 'lib/yup';
import {
  userSchemaWithSkillIds,
  userSchemaWithSkills,
} from 'tests/utils/schemas';
import { currentUser, userFactory } from 'tests/factories/user.factory';
import { waitForEmails } from 'lib/mailer';
import { skill1, skill2 } from 'tests/factories/skills.factory';

describe('user endpoints', () => {
  describe('POST /users', () => {
    it('should register user', async () => {
      const { data } = await postPublic('/users', {
        body: {
          email: 'free-email@mail.com',
          password: 'password',
          firstName: 'first',
          lastName: 'last',
          isActive: true,
          address1: 'address1',
          city: 'City',
          state: 'State',
          zip: '123',
          phone: '123',
          podId: 1,
          skills: [skill1.id, skill2.id],
        },
        schema: object({
          token: string().required(),
          user: userSchemaWithSkillIds.required(),
        }),
      });

      expect(data.user.skills).toEqual([skill1, skill2].map(({ id }) => id));
    });

    it.each`
      field
      ${'email'}
      ${'password'}
      ${'firstName'}
      ${'lastName'}
      ${'address1'}
      ${'city'}
      ${'state'}
      ${'zip'}
      ${'phone'}
      ${'podId'}
    `('validates required field $field', async ({ field }) => {
      const user = userFactory.build();
      const { data } = await postPublic('/users', {
        body: {
          ...user,
          [field]: undefined,
        },
      });

      expect(data.error).toBe(`${field} is a required field`);
    });
  });

  describe('POST /users/login', () => {
    it('should login user', async () => {
      await postPublic('/users/login', {
        body: {
          email: currentUser.email,
          password: currentUser.password,
        },
        schema: object({
          token: string().required(),
          user: userSchemaWithSkills.required(),
        }),
      });
    });

    it.each`
      field
      ${'email'}
      ${'password'}
    `('should validate presence of $field', async ({ field }) => {
      const { data } = await postPublic('/users/login', {
        body: {
          email: currentUser.email,
          password: currentUser.password,
          [field]: undefined,
        },
      });

      expect(data.error).toBe(`${field} is a required field`);
    });
  });

  describe('POST /users/send-reset-password-email and POST /users/reset-password', () => {
    it('should reset password with the code from email', async () => {
      await postPublic('/users/send-reset-password-email', {
        body: {
          email: currentUser.email,
        },
      });

      const [email] = await waitForEmails();
      expect(email.to).toBe(currentUser.email);
      expect(email.subject).toBe('Reset Password');

      const match = email.html.match(/\d{5}/);
      expect(match).not.toBeNull();
      if (!match) return;

      const code = match[0];

      await postPublic('/users/reset-password', {
        body: {
          code,
          password: 'new-password',
        },
      });

      await postPublic('/users/login', {
        body: {
          email: currentUser.email,
          password: 'new-password',
        },
        schema: object({
          token: string().required(),
          user: userSchemaWithSkills.required(),
        }),
      });
    });
  });

  describe('GET /users/:id', () => {
    it('should return current user', async () => {
      await get(`/users/${currentUser.id}`, {
        schema: userSchemaWithSkills,
      });
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user', async () => {
      const params = {
        email: 'new-email@mail.com',
        password: 'new-password',
        firstName: 'new name',
        lastName: 'new last name',
        isActive: false,
        address1: 'new address1',
        address2: 'new address2',
        city: 'new city',
        country: 'new country',
        state: 'new state',
        zip: '321',
        phone: '321',
        podId: 2,
        skills: [skill1.id, skill2.id],
      };

      const { data } = await patch(`/users/${currentUser.id}`, {
        body: {
          ...params,
          password: 'new-password',
        },
        schema: object({
          user: userSchemaWithSkills.required(),
        }),
      });

      const { password, skills, ...paramsUser } = params;
      expect(data.user).toMatchObject(paramsUser);

      expect(
        data.user.skills.map(({ id, name }: typeof skill1) => ({ id, name })),
      ).toEqual([skill1, skill2].map(({ id, name }) => ({ id, name })));

      await postPublic('/users/login', {
        body: {
          email: params.email,
          password,
        },
        schema: object({
          token: string().required(),
          user: userSchemaWithSkills.required(),
        }),
      });
    });
  });
});
