import createHttpError from 'http-errors';
import path from 'node:path';
import fs from 'node:fs/promises';
import {
  findUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../services/auth.js';
import { setupSessionCookies } from '../utils/createSession.js';
import { sendEmail } from '../utils/sendMail.js';
import { TEMPLATES_DIR } from '../constants/index.js';

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

export const requestResetPasswordByEmailController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  // const resetToken = jwt.sign(
  //   {
  //     sub: user._id,
  //     email,
  //   },
  //   env('JWT_SECRET'),
  //   {
  //     expiresIn: '5m',
  //   },
  // );
  
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  
  // const template = handlebars.compile(templateSource);
  // const html = template({
  //   name: user.name,
  //   code: `1234`,
  // });
  
  try {

    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: 'test',
    });
  } catch{ 
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
  // await requestResetToken(email);
  res.json({
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
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
