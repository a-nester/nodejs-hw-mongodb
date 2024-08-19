import { randomBytes } from 'crypto';
import crypto from 'crypto';
import { FIFTEEN_MINUTES } from '../constants/index.js';
import { THIRTY_DAYS } from '../constants/index.js';

export const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + FIFTEEN_MINUTES;
  const refreshTokenValidUntil = Date.now() + THIRTY_DAYS;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};
