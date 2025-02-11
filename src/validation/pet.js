import Joi from 'joi';

export const createPetScheme = Joi.object({
  codeId: Joi.string().required(),
  name: Joi.string().required(),
  birthday: Joi.date().required(),
  phone: Joi.string().required(),
  gender: Joi.string().required(),
  breed: Joi.string().required(),
  color: Joi.string().required(),
  telegram: Joi.string().required(),
  avatar: Joi.string().allow('').optional(),
});

export const patchPetScheme = Joi.object({
  name: Joi.string().optional(),
  birthday: Joi.string().optional(),
  phone: Joi.string().optional(),
  gender: Joi.string().optional(),
  breed: Joi.string().optional(),
  color: Joi.string().optional(),
  telegram: Joi.string().optional(),
  avatar: Joi.string().allow('').optional(),
  code:Joi.string().required()
});
