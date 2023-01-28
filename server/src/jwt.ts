import jwt from 'jsonwebtoken';
import config from 'config';

export const createToken = ({
  id,
  type,
}: {
  id: number;
  type: 'user' | 'admin';
}) => jwt.sign({ id, type }, config.jwtSecret);
