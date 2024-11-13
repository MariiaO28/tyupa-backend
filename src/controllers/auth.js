import createHttpError from 'http-errors';
import {
  findUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../services/auth.js';
import { setupSessionCookies } from '../utils/createSession.js';

export const registerUserController = async (req, res) => {
  const { email } = req.body;
  const userInDB = await findUser({ email });
  if (userInDB) {
    throw createHttpError(409, 'Email in use');
  }
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered an user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const { user, session } = await loginUser(req.body);
  setupSessionCookies(res, session);
  res.status(200).json({
    status: 200,
    message: 'Successfully login an user',
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};

export const logoutUserController = async (req, res) => {
  console.log('Login start!!!!');

  const keysReq = Object.keys(req);
  console.log(keysReq);

  const sessionId = req.cookies.sessionId;
  console.log(`SESSION: ${sessionId}`);

  if (sessionId) {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId', {
    httpOnly: true,
    sameSite: 'none',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'none',
  });

  res.status(204).send();
};
