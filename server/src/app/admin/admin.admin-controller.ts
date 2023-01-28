import { publicHandler } from 'lib/requestHandler';
import { object, string } from 'yup';
import * as service from 'app/admin/admin.service';

export const login = publicHandler(
  {
    body: object({
      email: string().email().required(),
      password: string().min(6).required(),
    }),
  },
  async (req, res) => {
    const tokenAndAdmin = await service.login(req.body);
    res.json(tokenAndAdmin);
  },
);

export const register = publicHandler(
  {
    body: object({
      email: string().email().required(),
      password: string().min(6).required(),
      firstName: string().required(),
      lastName: string().required(),
    }),
  },
  async (req, res) => {
    await service.register(req.body);
    res.end();
  },
);

export const sendResetPasswordEmail = publicHandler(
  {
    body: object({
      email: string().email().required(),
    }),
  },
  async (req, res) => {
    await service.sendResetPasswordEmail(req.body.email);
    res.end();
  },
);

export const resetPassword = publicHandler(
  {
    body: object({
      code: string().required(),
      password: string().required(),
    }),
  },
  async (req, res) => {
    await service.resetPassword(req.body);
    res.end();
  },
);
