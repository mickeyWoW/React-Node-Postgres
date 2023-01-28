import { publicHandler, requestHandler } from 'lib/requestHandler';
import { array, boolean, number, object, string } from 'yup';
import * as service from 'app/user/user.service';
import { ForbiddenError } from 'errors';
import { userColumns } from 'app/user/user.model';

export const register = publicHandler(
  {
    body: object().shape({
      email: string().email().required(),
      password: string().min(6).required(),
      firstName: string().required(),
      lastName: string().required(),
      isActive: boolean(),
      address1: string().required(),
      address2: string(),
      city: string().required(),
      state: string().required(),
      zip: string().required(),
      phone: string().required(),
      podId: number().required(),
      skills: array(number().required()).required(),
    }),
  },
  async (req, res) => {
    const tokenAndUser = await service.register(req.body);
    res.json(tokenAndUser);
  },
);

export const login = publicHandler(
  {
    body: object({
      email: string().email().required(),
      password: string().min(6).required(),
    }),
  },
  async (req, res) => {
    const { email, password } = req.body;
    const tokenAndUser = await service.login({ email, password });
    res.json(tokenAndUser);
  },
);

export const getUserById = requestHandler(
  {
    params: object({
      id: number().required(),
    }),
  },
  async (req, res) => {
    const id = req.params.id;
    if (id !== req.user.id) {
      throw new ForbiddenError();
    }

    const user = await service.getUserById(id, {
      select: [...userColumns, 'skills'],
    });
    delete user.password;

    res.json(user);
  },
);

export const updateUser = requestHandler(
  {
    params: object({
      id: number().required(),
    }),
    body: object({
      email: string().email(),
      password: string().min(6),
      firstName: string(),
      lastName: string(),
      isActive: boolean(),
      address1: string(),
      address2: string(),
      city: string(),
      state: string(),
      zip: string(),
      phone: string(),
      podId: number(),
      skills: array(number().required()), // add skills
    }),
  },
  async (req, res) => {
    const { id } = req.params;
    if (id !== req.user.id) {
      throw new ForbiddenError();
    }

    const { skills: skillIds, ...other } = req.body;
    const user = await service.updateUser({ id, ...other, skillIds });
    delete user.password;

    res.json({ user });
  },
);

export const sendResetPasswordEmail = publicHandler(
  {
    body: object({
      email: string().email().required(),
    }),
  },
  async (req, res) => {
    await service.sendResetPasswordEmail(req.body);
    res.json(true);
  },
);

export const resetPassword = publicHandler(
  {
    body: object({
      code: string().required(),
      password: string().min(6).required(),
    }),
  },
  async (req, res) => {
    await service.resetPassword(req.body);
    res.json(true);
  },
);
