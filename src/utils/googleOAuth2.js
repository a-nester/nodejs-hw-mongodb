import * as fs from 'node:fs';
import path from 'node:path';
import { OAuth2Client } from 'google-auth-library';
import { env } from './env.js';
import { GOOGLE_OAUTH } from '../constants/index.js';
import createHttpError from 'http-errors';

const CONFIG = JSON.parse(
  fs.readFileSync(path.resolve('src', 'google-oauth-credentials.json'), {
    encoding: 'utf-8',
  }),
);

const googleOAuth2Client = new OAuth2Client({
  clientId: env(GOOGLE_OAUTH.GOOGLE_AUTH_CLIENT_ID),
  clientSecret: env(GOOGLE_OAUTH.GOOGLE_AUTH_CLIENT_SECRET),
  redirectUri: CONFIG['web']['redirect_uris'][0],
});

export const generateAuthUrl = () => {
  return googleOAuth2Client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};

export const validateCode = async (code) => {
  const response = await googleOAuth2Client.getToken(code);

  if (typeof response.tokens.id_token === 'undefined') {
    throw createHttpError(401, 'Unauthorized');
  }

  return googleOAuth2Client.verifyIdToken({
    idToken: response.tokens.id_token,
  });
};
