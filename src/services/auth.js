import { Session } from '../db/models/Session.js';
import { User } from '../db/models/User.js';
import bcrypt from 'bcrypt';
import { createSession } from '../utils/createSession.js';

export const findUserByEmail = (email) => User.findOne({ email });

export const findUserById = (userId) => User.findById(userId);

export const registerUser = async (userData) => {
  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  return await User.create({
    ...userData,
    password: encryptedPassword,
  });
};

export const findSessionById = ({ sessionId, refreshToken }) => {
  return Session.findOne({ _id: sessionId, refreshToken });
};

export const findSessionByToken = async (token) => {
  return await Session.findOne({ accessToken: token });
};

export const setupSession = async (userId) => {
  await Session.deleteOne({ userId });
  return Session.create({ userId, ...createSession() });
};
