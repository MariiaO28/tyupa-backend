import Joi from 'joi';

export const createQRCodeSchema = Joi.object({
    count: Joi.number().integer().min(1).required(),
    codeId: Joi.string().optional(),
    isAssigned: Joi.boolean().default(false),
    userId: Joi.string().allow(null).optional(),
  });
