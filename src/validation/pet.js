import Joi from 'joi';

export const createPetScheme = Joi.object({
  name: Joi.string().required(),
  birthday: Joi.string().required(),
  phone: Joi.string().required(),
  gender: Joi.string().required(),
  breed: Joi.string().required(),
  color: Joi.string().required(),
  telegram: Joi.string().required(),
});

export const patchPetScheme = Joi.object({
  name: Joi.string(),
  birthday: Joi.string(),
  phone: Joi.string(),
  gender: Joi.string(),
  breed: Joi.string(),
  color: Joi.string(),
  telegram: Joi.string(),
  code:Joi.string().required()
});
