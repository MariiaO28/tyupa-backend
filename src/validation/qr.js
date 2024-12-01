import Joi from 'joi';

export const createQRCodeSchema = Joi.object({
    codeId: Joi.number().required(),
    isAssigned: Joi.boolean().default(false),
    qrCodeImageUrl: Joi.string().allow(null),
    qrCodeImagePath: Joi.string().allow(null),
  });
