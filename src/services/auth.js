import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';

export const registerUser = async (userData) => {
  const encryptedPassword = bcrypt.hash(userData.password, 10);

  return await User.create({
    ...userData,
    password: encryptedPassword,
  });
};
