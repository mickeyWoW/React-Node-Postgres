import { Admin } from 'app/admin/admin.model';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { NotFoundError, ValidationError } from 'errors';
import * as mailer from 'app/admin/admin.mailer';
import randomatic from 'randomatic';
import dayjs from 'dayjs';
import { encryptPassword } from 'lib/password';
import { createToken } from 'jwt';

export const getById = async (id: number) => {
  const repo = getRepository(Admin);
  return await repo.findOneOrFail(id);
};

export const login = async ({
  email,
  password,
}: Pick<Admin, 'email' | 'password'>) => {
  const repo = getRepository(Admin);
  const admin = await repo.findOne({ email });
  if (!admin) throw new ValidationError('Email is not registered');

  if (!(await bcrypt.compare(password, admin.password as string)))
    throw new ValidationError('Invalid password');

  if (!admin.isActive)
    throw new ValidationError('Account was not activated yet');

  delete admin.password;

  return {
    token: createToken({ id: admin.id, type: 'admin' }),
    admin,
  };
};

export const register = async (
  params: Pick<Admin, 'email' | 'firstName' | 'lastName'> & {
    password: string;
  },
) => {
  const repo = getRepository(Admin);
  const admin = repo.create({
    ...params,
    password: await encryptPassword(params.password),
  });

  try {
    await repo.save(admin);
  } catch (error) {
    throw new ValidationError('Admin with such email already exists');
  }

  return admin;
};

export const sendResetPasswordEmail = async (email: string) => {
  const repo = getRepository(Admin);
  const admin = await repo.findOne({ email });
  if (!admin) throw new NotFoundError();

  admin.resetPasswordToken = randomatic('00000');
  admin.resetPasswordExpiresAt = dayjs().add(10, 'm').toDate();

  await repo.save(admin);

  mailer.sendResetPasswordEmail({
    to: email,
    token: admin.resetPasswordToken,
  });
};

export const resetPassword = async ({
  code,
  password,
}: {
  code: string;
  password: string;
}) => {
  const repo = getRepository(Admin);
  const admin = await repo.findOne({
    resetPasswordToken: code,
  });

  if (!admin) throw new ValidationError('Code is invalid');

  if (
    !admin.resetPasswordExpiresAt ||
    admin.resetPasswordExpiresAt < new Date()
  )
    throw new ValidationError('Code is expired');

  admin.resetPasswordToken = (null as unknown) as undefined;
  admin.resetPasswordExpiresAt = (null as unknown) as undefined;
  admin.password = await encryptPassword(password);

  return repo.save(admin);
};
