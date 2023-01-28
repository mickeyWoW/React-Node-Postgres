import { post } from 'lib/fetch';
import { Admin } from 'components/Admin/types';

export const adminAPI = {
  async login(data: { email: string; password: string }) {
    return await post<{ token: string; admin: Admin }>(
      '/api/admin/users/login',
      {
        data,
      },
    );
  },

  async register(
    data: Pick<Admin, 'firstName' | 'lastName' | 'email'> & {
      password: string;
    },
  ) {
    await post<void>('/api/admin/users', {
      data,
    });
  },

  async sendResetPasswordEmail(data: Pick<Admin, 'email'>) {
    await post<void>('/api/admin/users/send-reset-password-email', { data });
  },

  async resetPassword(data: { code: string; password: string }) {
    await post<void>('/api/admin/users/reset-password', { data });
  },
};
