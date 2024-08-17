import createHttpError from 'http-errors';

import { registerUser } from '../services/auth.js';
import { findUserByEmail } from '../services/auth.js';

export const registerUserController = async (req, res, next) => {
  const { name, email } = req.body;
  const user = await findUserByEmail(email);

  if (user) throw createHttpError(409, 'Email in use!');

  await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user',
    data: {
      name,
      email,
    },
  });
};
