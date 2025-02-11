import Joi from 'joi';

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  codeId: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  codeId: Joi.string().optional(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object({
  otp: Joi.string().min(4).max(4).required(),
  password: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object({
  otp: Joi.string().min(4).max(4).required(),
  password: Joi.string().required(),
});
