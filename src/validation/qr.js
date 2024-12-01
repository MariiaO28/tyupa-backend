import Joi from 'joi';

export const createQRCodeSchema = Joi.object({
  count: Joi.number().required(),
});
