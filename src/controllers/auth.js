import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

import {
  findSessionById,
  registerUser,
  requestResetToken,
  setupSession,
} from '../services/auth.js';
import { findUserByEmail } from '../services/auth.js';
import { setupCookie } from '../utils/setupCookie.js';
import { Session } from '../db/models/Session.js';
import { User } from '../db/models/User.js';
import { env } from '../utils/env.js';
import { generateAuthUrl, validateCode } from '../utils/googleOAuth2.js';

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

export const logoutUserController = async (req, res, next) => {
  if (typeof req.cookies.sessionId === 'string') {
    await Session.deleteOne({ _id: req.cookies.sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
};

export const requestResetEmailController = async (req, res) => {
  const user = await findUserByEmail(req.body.email);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  try {
    await requestResetToken(user);
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
    throw error;
  }

  res.status(200).json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  let entries;

  try {
    entries = jwt.verify(req.body.token, env('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(req.body.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });

  res.status(200).json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};

export const getOAuthURLController = async (req, res) => {
  const url = generateAuthUrl();

  res.status(200).json({
    status: 200,
    message: 'Successfully get Google OAuth URL',
    data: { url },
  });
};

export const confirmOAutController = async (req, res) => {
  const { code } = req.body;

  const ticket = await validateCode(code);

  const payload = ticket.getPayload();

  if (!payload) {
    throw createHttpError(401, 'Unauthorized');
  }

  const user = await findUserByEmail(payload.email);

  const password = await bcrypt.hash(
    crypto.randomBytes(30).toString('base64'),
    10,
  );
  if (user === null) {
    await User.create({
      email: payload.email,
      name: payload.name,
      password,
    });
  }

  const session = await setupSession(user._id);
  setupCookie(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};
