import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import { hashCompare, hashValue } from '../utils/hashFuncs.js';

export const findUser = (filter) => UsersCollection.findOne(filter);

export const registerUser = async (payload) => {
  const encryptedPassword = await hashValue(payload.password);
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await findUser({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await hashCompare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  await SessionsCollection.deleteOne({ userId: user._id });
  const newSession = createSession();

  const session = await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
  return { user, session };
};

export const requestResetToken = async(email)=>{

};
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

