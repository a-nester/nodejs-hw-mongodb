import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, res, next) => {
  const { name, email } = req.body;
  const user = User.findOne({ email });

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
