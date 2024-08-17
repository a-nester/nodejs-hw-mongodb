import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';

export const findUserByEmail = (email) => User.findOne({ email });

export const registerUser = async (userData) => {
  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  return await User.create({
    ...userData,
    password: encryptedPassword,
  });
};
