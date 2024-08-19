import { Session } from '../db/models/Session.js';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { createSession } from '../utils/createSession.js';

export const findUserByEmail = (email) => User.findOne({ email });

export const findSessionById = (id, refreshToken) =>
  Session.findOne({ _id: id, refreshToken });

export const registerUser = async (userData) => {
  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  return await User.create({
    ...userData,
    password: encryptedPassword,
  });
};

export const setupSession = async (userId) => {
  await Session.deleteOne(userId);
  return Session.create({ userId, ...createSession() });
};
