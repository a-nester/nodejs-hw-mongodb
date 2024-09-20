import { THIRTY_DAYS } from '../constants/index.js';

export const setupCookie = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    maxAge: THIRTY_DAYS,
    // sameSite: 'None',
    // secure: true,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    maxAge: THIRTY_DAYS,
    // sameSite: 'None',
    // secure: true,
  });
};
