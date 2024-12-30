import { Router } from 'express';
import {
  createPetController,
  deletePetController,
  getAllPetsController,
  getPetByIdController,
  patchPetController,
} from '../controllers/pets.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createPetScheme, patchPetScheme } from '../validation/pet.js';
import { authenticate } from '../middlewares/authenticate.js';
import isValidId from '../middlewares/isValidId.js';

const petsRouter = Router();

petsRouter.get('/', ctrlWrapper(getAllPetsController));

petsRouter.get('/:petId', isValidId, ctrlWrapper(getPetByIdController));
petsRouter.use(authenticate);

petsRouter.post(
  '/',
  validateBody(createPetScheme),
  ctrlWrapper(createPetController),
);

petsRouter.patch(
  '/:petId', isValidId,
  validateBody(patchPetScheme),
  ctrlWrapper(patchPetController),
);
petsRouter.delete('/:petId', isValidId, ctrlWrapper(deletePetController));

export default petsRouter;
