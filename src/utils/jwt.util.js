import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};
