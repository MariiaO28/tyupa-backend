import { Router } from 'express';
import authRouter from './auth.js';
import qrCodeRouter from './qr.js';

const router = Router();

router.use('/auth', authRouter);

// router.use('/pets-info', petsRouter);

router.use('/qr', qrCodeRouter);

export default router;
