import bcrypt from 'bcrypt';

export const hashCompare = (userPaylod, hashValue) =>
  bcrypt.compare(userPaylod, hashValue);

export const hashValue = (value) => bcrypt.hash(value, 10);
