import { Router } from 'express';
import authRouter from './auth.js';
import petsRouter from './pets.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/pets', petsRouter);

export default router;
