import { Router } from 'express';
import {
  createPetController,
  deletePetController,
  getAllPetsController,
  getPetByIdController,
  patchPetController,
  updatePetPhotoController,
} from '../controllers/pets.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createPetScheme, patchPetScheme } from '../validation/pet.js';
import { authenticate } from '../middlewares/authenticate.js';
import isValidId from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';

const petsRouter = Router();

petsRouter.get(
  '/',
  ctrlWrapper(getAllPetsController));

petsRouter.get(
  '/:petId',
  isValidId,
  ctrlWrapper(getPetByIdController));

petsRouter.post(
  '/create',
  validateBody(createPetScheme),
  ctrlWrapper(createPetController),
);

petsRouter.patch(
  '/:petId',
  isValidId,
  authenticate,
  validateBody(patchPetScheme),
  ctrlWrapper(patchPetController),
);

petsRouter.patch(
  '/:petId/photo',
  isValidId,
  upload.single('avatar'),
  authenticate,
  validateBody(patchPetScheme),
  ctrlWrapper(updatePetPhotoController),
);

petsRouter.delete(
  '/:petId',
  isValidId,
  authenticate,
  ctrlWrapper(deletePetController));

export default petsRouter;
