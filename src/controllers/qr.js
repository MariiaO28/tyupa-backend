import { generateBatchQRCodes, processQRCodeService } from '../services/qr.js';
import { setupSessionCookies } from '../utils/createSession.js';

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
    const result = await processQRCodeService(codeId);

    if (result.session) {
      setupSessionCookies(res, result.session);
    }

    return res.status(200).json({
      status: 200,
      message: result.message,
      redirectUrl: result.redirectUrl,
      ...(result.body && { body: result.body }),
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
  };
