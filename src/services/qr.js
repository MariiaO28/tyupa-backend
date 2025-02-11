import QRCode from 'qrcode';
import mongoose from 'mongoose';
import path from 'path';
import createHttpError from 'http-errors';
import { QRCodeCollection } from '../db/models/qr.js';
import { UsersCollection } from '../db/models/user.js';
import { QR_CREATE_DIR } from '../constants/index.js';
import { createSession } from '../utils/createSession.js';

export const generateBatchQRCodes = async (count) => {
    const codes = [];

    for (let i = 0; i < count; i++) {
        const codeId = new mongoose.Types.ObjectId();
        const url = `${process.env.APP_DOMAIN}/scanQR/${codeId}`;
        const outputPath = path.join(QR_CREATE_DIR, `${codeId}.png`);

        await QRCode.toFile(outputPath, url, { errorCorrectionLevel: 'H' });
        console.log(`QR code saved at: ${outputPath}`);

        const qrCode = new QRCodeCollection({
            codeId,
            qrCodeImageUrl: `${process.env.APP_DOMAIN}/qr-codes/${codeId}.png`,
            qrCodeImagePath: outputPath,
        });

        const savedQRCode = await qrCode.save();
        console.log(savedQRCode);

        codes.push({
            codeId,
            qrCodeImageUrl:`${process.env.APP_DOMAIN}/qr-codes/${codeId}.png`,
            qrCodeImagePath: outputPath,
        });
    }
    return codes;
    };

export const processQRCodeService = async (codeId) => {
    const qrCode = await QRCodeCollection.findOne({ codeId });

    if (!qrCode) {
      throw createHttpError(404, 'QR Code not found');
    }

    if (qrCode.isAssigned) {
      if (!qrCode.petId) {
        throw createHttpError(400, 'QR Code is marked as assigned but missing a petId.');
      }

      return {
        message: 'QR Code is assigned. Redirecting to pet profile.',
        redirectUrl: `/pets/${qrCode.petId}`,
      };
    }

    if (!qrCode.petId) {
      return {
        message: 'QR Code not assigned to a pet. Redirect to registration.',
        redirectUrl: '/auth/register',
        body: { codeId },
      };
    }

    const petId = qrCode.petId;

    const user = await UsersCollection.findOne({ petId });
    if (user) {
      const session = await createSession(user._id);
      return {
        message: 'QR Code assigned to a pet. Redirecting to a pet profile.',
        redirectUrl: `/pets/${ petId }`,
        session,
      };
    }

    throw createHttpError(401, 'No user associated with this pet.');
};

    // export const processQRCode = async (codeId) => {
    //     const qrCode = await QRCodeCollection.findOne({ codeId });

    //     if (!qrCode) {
    //         throw createHttpError(404, 'QR Code not found');
    //     }

    //     // Перевірка на наявність улюбленця
    //     if (qrCode.petId) {
    //         return { redirectUrl: `/pets/${qrCode.petId}` };
    //     }

    //     return { redirectUrl: `/pets/create?codeId=${codeId}` };
    // };

    // export const assignPetAndUserToQRCode = async (req, res) => {
    //     const { codeId, petId, userId } = req.body;

    //     if (!petId || !userId) {
    //         return res.status(400).json({
    //             status: 400,
    //             message: 'petId and userId are required.',
    //         });
    //     }

    //     try {
    //         const qrCode = await QRCodeCollection.findOneAndUpdate(
    //             { codeId },
    //             { petId, userId },
    //             { new: true } // Returns the updated document
    //         );

    //         if (!qrCode) {
    //             return res.status(404).json({
    //                 status: 404,
    //                 message: 'QR Code not found',
    //             });
    //         }

    //         res.status(200).json({
    //             status: 200,
    //             message: 'QR Code updated successfully',
    //             data: qrCode,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({
    //             status: 500,
    //             message: 'Failed to update QR code',
    //         });
    //     }
    // };
