import { THIRTY_DAYS } from '../constants/index.js';

export const setupCookie = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    // httpOnly: true,
    expire: THIRTY_DAYS,
    sameSite: 'lax',
    secure: true,
  });

  res.cookie('sessionId', session._id, {
    // httpOnly: true,
    expire: THIRTY_DAYS,
    sameSite: 'lax',
    secure: true,
  });
};
