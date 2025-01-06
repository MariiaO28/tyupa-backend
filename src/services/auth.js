import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import { hashCompare, hashValue } from '../utils/hashFuncs.js';
import { QRCodeCollection } from '../db/models/qr.js';
import userOTPjs from '../db/models/userOTP.js';

export const findUser = (filter) => UsersCollection.findOne(filter);

export const registerUser = async (payload) => {
  const encryptedPassword = await hashValue(payload.password|| 'defaultPassword');
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

// export const loginUser = async (payload) => {
//   const user = await findUser({ email: payload.email });
//   if (!user) {
//     throw createHttpError(404, 'User not found');
//   }
//   const isEqual = await hashCompare(payload.password, user.password);
//   if (!isEqual) {
//     throw createHttpError(401, 'Unauthorized');
//   }
//   await SessionsCollection.deleteOne({ userId: user._id });
//   const newSession = createSession();

//   const session = await SessionsCollection.create({
//     userId: user._id,
//     ...newSession,
//   });
//   return { user, session };
// };

export const loginUser = async (payload) => {
  const { codeId, email, password } = payload;
  let user;

  // Логін через QR-код
  if (codeId) {
    const qrCode = await QRCodeCollection.findOne({ codeId });

    if (!qrCode || !qrCode.isAssigned || !qrCode.userId) {
      throw createHttpError(400, 'Invalid or unassigned QR Code');
    }

    user = await findUser({ _id: qrCode.userId });
    if (!user) {
      throw createHttpError(404, 'User associated with QR Code not found');
    }
  }
  // Логін через email і password
  else if (email && password) {
    user = await findUser({ email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const isPasswordCorrect = await hashCompare(password, user.password);
    if (!isPasswordCorrect) {
      throw createHttpError(401, 'Invalid email or password');
    }
  } else {
    throw createHttpError(400, 'Invalid login data');
  }

    await SessionsCollection.deleteOne({ userId: user._id });
    const newSession = createSession();

    const session = await SessionsCollection.create({
    userId: user._id,
    ...newSession,
   });
  return { user, session };
};

export const createNewOTP = async (data) => {
  return await userOTPjs.create(data);
};
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};
