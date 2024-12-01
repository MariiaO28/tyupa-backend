import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { generateQRCodeBatch, scanQRCode } from '../controllers/qr.js';
import { createQRCodeSchema } from '../validation/qr.js';

const qrCodeRouter = Router();

qrCodeRouter.post(
    '/generateBatchQR',
    validateBody(createQRCodeSchema),
    ctrlWrapper(generateQRCodeBatch),
);

qrCodeRouter.get(
    '/scanQR/:codeId',
    ctrlWrapper(scanQRCode),
);

// qrCodeRouter.put(
//     '/assignPetAndUserToQRCode',
//     validateBody(createQRCodeSchema),
//     ctrlWrapper(assignPetAndUserToQRCode),
// );

export default qrCodeRouter;
