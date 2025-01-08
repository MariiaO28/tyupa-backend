import createHttpError from 'http-errors';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import {
  createNewOTP,
  findUser,
  loginUser,
  logoutUser,
  registerUser,
  findUserOTP,
  passwordReset,
} from '../services/auth.js';
import { setupSessionCookies } from '../utils/createSession.js';
import { sendEmail } from '../utils/sendMail.js';
import {
  FIFTEEN_MINUTES,
  FRONTEND_URL,
  TEMPLATES_DIR,
} from '../constants/index.js';
import getDigit from '../utils/getDigit.js';
import { hashValue, hashCompare } from '../utils/hashFuncs.js';
import userOPTCollection from '../db/models/userOTP.js';

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

  const resetPin = getDigit();
  const hashedPin = await hashValue(resetPin);
  
 
  const newOTPEntry = await createNewOTP(
    new userOPTCollection({
      userId: user._id,
      otp: hashedPin,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + FIFTEEN_MINUTES),
    }),
  );


  if (!newOTPEntry) {
    throw createHttpError(500, 'Failed to create new OTP entry');
  }

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    code: resetPin,
    reset_link: `${FRONTEND_URL}/reset-password/${user._id}`,
    // logo: `${FRONTEND_URL}/assets/assets/logo_tablet1x-C2mOCeVL.png`,
  });

  try {
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
  res.json({
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
  });
};

export const updatePasswordController = async (req, res) => {
  const { otp, password } = req.body;
  const { userId } = req.params;
 
  const otpEntry = await findUserOTP(userId);

  if (!otpEntry) {
    throw createHttpError(400, 'A reset code has expired or does not exist');
  }

  const isPinValid = await hashCompare(otp, otpEntry.otp);
  if (!isPinValid) {
    throw createHttpError(400, 'Invalid reset code');
  }

  const newHashedPin = await hashValue(password);
  const isUpdated = await passwordReset(userId, newHashedPin);
  if (!isUpdated) {
    throw createHttpError(500, 'Failed to update the password');
  }

  res.json({
    message: 'Your password has been successfully updated.',
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
