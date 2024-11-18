import { Router } from 'express';
import authRouter from './auth.js';
import petsRouter from './pets.js';
import qrCodeRouter from './qr.js';

const router = Router();

router.use('/auth', authRouter);

router.use('/pets', petsRouter);

router.use('/qr', qrCodeRouter);

export default router;
