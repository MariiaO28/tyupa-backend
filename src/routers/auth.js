import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  registerUserController,
  requestResetPasswordByEmailController,
} from '../controllers/auth.js';
import { loginUserSchema, registerUserSchema, requestResetEmailSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetPasswordByEmailController),
);

authRouter.post('/logout', ctrlWrapper(logoutUserController));

export default authRouter;
