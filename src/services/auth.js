import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import { hashCompare, hashValue } from '../utils/hashFuncs.js';
import { QRCodeCollection } from '../db/models/qr.js';
import userOTP from '../db/models/userOTP.js';

export const findUser = (filter) => UsersCollection.findOne(filter);

export const registerUser = async (payload) => {
  const { email, password, petId } = payload;

  const encryptedPassword = await hashValue(password);

  const user = await UsersCollection.create({
    email,
    password: encryptedPassword,
    petId,
  });

  return user;
};

// export const registerUserWithQRCode = async (payload) => {
//   const { codeId, email, password } = payload;

//   const qrCode = await QRCodeCollection.findOne({ codeId });
//   if (!qrCode) throw createHttpError(404, 'QR Code not found');
//   if (!qrCode.petId) throw createHttpError(400, 'No pet associated with this QR Code');

//   const user = await registerUser({
//     email,
//     password,
//     petId: qrCode.petId,
//   });

//   const newSession = createSession();
//   const session = await SessionsCollection.create({
//     userId: user._id,
//     ...newSession,
//   });

//   return { user, session };
// };

const handleQRCodeLogic = async (codeId) => {
  const qrCode = await QRCodeCollection.findOne({ codeId });
  if (!qrCode) {
    throw createHttpError(404, 'QR Code not found');
  }
  if (qrCode.isAssigned && qrCode.petId && qrCode.userId) {
    const user = await UsersCollection.findOne({ _id: qrCode.userId });

    if (!user) {
      return { redirectUrl: '/pets/create'};
    }
    return user;

  } else {
    const petId = qrCode.petId;
    if (!petId) {
      throw createHttpError(400, 'No pet associated with this QR Code');
    }
    return { redirectUrl: `/pets/${qrCode.petId}` };
  }
};

export const loginUser = async (payload, isDesktop = false) => {
  if (!payload) {
    throw createHttpError(400, 'No login data provided');
  }

  const { codeId, email, password } = payload;
  let user;

  if (codeId) {
    const qrLogicResult = await handleQRCodeLogic(codeId);
    if (qrLogicResult.redirectUrl) {
      return qrLogicResult;
    }

    user = qrLogicResult;
  } else if (isDesktop && email && password) {
    user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const isPasswordCorrect = await hashCompare(password, user.password);
    if (!isPasswordCorrect) throw createHttpError(401, 'Invalid email or password');
  } else {
    throw createHttpError(400, 'Invalid login data');
  }

  await SessionsCollection.deleteMany({ userId: user._id });

  const newSession = createSession();
  const session = await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
  return { user, session };
};

export const findUserOTP = async (userId) => {
  return userOTP.findOne({
  userId,
  expiresAt: { $gt: new Date() },
  });
};

export const passwordReset = async (userId, password) => {
  const user = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    { password },
  );

  await SessionsCollection.deleteMany({ userId });
  await userOTP.deleteOne({ userId });

  return user;
};

export const createNewOTP = async (data) => {
    return await userOTP.create(data);
 };


export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};
