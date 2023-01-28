import { useMutation } from 'react-query';
import { adminAPI } from 'components/Admin/api';
import history from 'lib/history';
import routes from 'routes';

import { setItem, useLocalStorage } from 'lib/localStorage';
import { Admin } from 'components/Admin/types';
import { queryClient } from 'lib/queryClient';
import { toast } from 'react-toastify';

const storageKey = 'currentAdmin';

const validateUser = (admin: Admin) => {
  if (
    admin &&
    'token' in admin &&
    'id' in admin &&
    'email' in admin &&
    'firstName' in admin &&
    'lastName' in admin
  )
    return admin;
};

let currentAdmin: Admin | undefined;

export const setCurrentAdmin = (admin?: Admin) => {
  currentAdmin = admin;
  setItem(storageKey, admin ? JSON.stringify(admin) : null);
  if (!admin) queryClient.clear();
};

export const useCurrentAdmin = () => {
  const [json] = useLocalStorage(storageKey);

  if (!currentAdmin)
    currentAdmin = json ? validateUser(JSON.parse(json) as Admin) : undefined;

  return currentAdmin;
};

export const getCurrentAdmin = () => {
  if (!currentAdmin) {
    const json = localStorage.getItem(storageKey);
    currentAdmin = JSON.parse(json as string);
  }
  return currentAdmin;
};

export const getAdminToken = () => getCurrentAdmin()?.token;

export const useLoginQuery = () => {
  const { mutate: login, error } = useMutation(adminAPI.login, {
    onSuccess({ token, admin }) {
      setCurrentAdmin({ ...admin, token });
    },
  });

  const errorMessage = (error as Error)?.message || '';
  const notActivated = errorMessage.includes('not activated');

  return { login, error, notActivated };
};

export const useRegisterQuery = () => {
  const { mutate: register, error } = useMutation(adminAPI.register, {
    onSuccess() {
      history.push(routes.registrationSuccess);
    },
  });

  return { register, error };
};

export const useSendResetPassowrdEmailQuery = () => {
  const { mutate: sendResetPasswordEmail, ...other } = useMutation(
    adminAPI.sendResetPasswordEmail,
  );
  return { sendResetPasswordEmail, ...other };
};

export const useResetPasswordQuery = () => {
  const { mutate: resetPassword, ...other } = useMutation(
    adminAPI.resetPassword,
    {
      onSuccess() {
        history.push(routes.login);
        toast.info('New password was saved');
      },
    },
  );

  return { resetPassword, ...other };
};
