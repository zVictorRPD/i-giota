import { type H3Event } from 'h3';
import jwt from 'jsonwebtoken';
import { IUser } from '~/interfaces/user';

export const requireAuth = (event: H3Event): IUser => {
  const token = getCookie(event, 'auth_token');

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Não autenticado' });
  }

  try {
    const secret = process.env.JWT_SECRET || "super-secret-key-for-dev";
    const decoded = jwt.verify(token, secret) as IUser;
    return decoded;
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Sessão inválida' });
  }
};