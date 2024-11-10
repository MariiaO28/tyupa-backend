import dotenv from 'dotenv';
dotenv.config();

const env = (name, deafaultValue) => {
    const value = process.env[name];
    if(value) return value;
    if(deafaultValue) return deafaultValue;
    throw new Error (`Missing: process.env[${name}].`);
};

export default env;
