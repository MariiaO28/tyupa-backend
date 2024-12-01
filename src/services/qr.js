import QRCode from 'qrcode';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import env from '../utils/env.js';
import { QRCodeCollection } from '../db/models/qr.js';

export const generateBatchQRCodes = async (count) => {
    const codes = [];

    for (let i = 0; i < count; i++) {
      const codeId = new mongoose.Types.ObjectId();
      const url = `${env('APP_DOMAIN')}/scanQR/${codeId}`;
      const qrCodeImage = await QRCode.toDataURL(url);

      const qrCode = new QRCodeCollection({ codeId });
      const savedQRCode = await qrCode.save();

      console.log('Saved QR code:', savedQRCode);

      codes.push({ qrCodeImage, codeId });
    }

    return codes;
  };


export const processQRCode = async (codeId) => {
    const qrCode = await QRCodeCollection.findOne({ codeId });

    if (!processQRCode) {
        throw createHttpError(404, 'QR Code not found');
      }

    if (qrCode.isAssigned && qrCode.petId) {
      return { redirectUrl: `/pet/${qrCode.petId}` };
    }

    return { redirectUrl: `/register/${codeId}` };
};
