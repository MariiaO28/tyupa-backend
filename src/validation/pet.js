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
  // owner: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required(),
});

export const patchPetScheme = Joi.object({
  name: Joi.string(),
  birthday: Joi.string(),
  phone: Joi.string(),
  gender: Joi.string(),
  breed: Joi.string(),
  color: Joi.string(),
  telegram: Joi.string(),
  avatar: Joi.string().allow('').optional(),
  // code:Joi.string().required()
});
