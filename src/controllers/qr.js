import createHttpError from 'http-errors';
import env from '../utils/env.js';
import { generateBatchQRCodes, processQRCode } from '../services/qr.js';

export const generateQRCodeBatch = async (req, res) => {
    const { count } = req.body;

    try {
        const qrCodes = await generateBatchQRCodes(count);

        res.status(201).json({
            status: 201,
            message:`${count} QR codes generated successfully`,
            data: qrCodes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: 'Failed to generate QR codes',
        });
    }
};


export const scanQRCode = async (req, res, next) => {
    const { codeId } = req.params;

    try {
      const { redirectUrl } = await processQRCode(codeId);
      return res.redirect(`${env('APP_DOMAIN')}${redirectUrl}`);
    }
    catch (error)
    {
      console.error(error);
      next(createHttpError(404, 'QR Code not found'));
    }
  };


