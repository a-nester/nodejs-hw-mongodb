import createHttpError from 'http-errors';

import {
  findSessionById,
  registerUser,
  setupSession,
} from '../services/auth.js';
import { findUserByEmail } from '../services/auth.js';
import bcrypt from 'bcrypt';
import { setupCookie } from '../utils/setupCookie.js';
import { Session } from '../db/models/Session.js';

export const registerUserController = async (req, res, next) => {
  const { name, email } = req.body;
  const user = await findUserByEmail(email);

  if (user) throw createHttpError(409, 'Email in use!');

  await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name,
      email,
    },
  });
};

export const loginUserController = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  const session = await setupSession(user._id);

  setupCookie(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshUserSessionController = async (req, res, next) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await findSessionById({
    sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({ _id: sessionId, refreshToken });

  const newSession = await setupSession(session.userId);

  setupCookie(res, newSession);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};
