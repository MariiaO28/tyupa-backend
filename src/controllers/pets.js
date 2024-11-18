import createHttpError from 'http-errors';
import {
  createPet,
  deletePet,
  getAllPets,
  getPetById,
  updatePet,
} from '../services/pets.js';

export const getAllPetsController = async (req, res, next) => {
  const pets = await getAllPets();
  if (!pets) {
    return next(createHttpError(401, 'Not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found pets ',
    data: pets,
  });
};

export const getPetByIdController = async (req, res, next) => {
  const { petId } = req.params;
  const pet = await getPetById(petId);
  if (!pet) {
    return next(createHttpError(404, 'Pet not found'));
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found pet with ID ${petId}`,
    data: pet,
  });
};

export const createPetController = async (req, res, next) => {
  const userId = req.user._id;
  const pet = await createPet({ owner: userId, ...req.body });
  if (!pet) {
    return next(createHttpError(400, 'Something went wrong'));
  }
  res.status(201).json({
    status: 201,
    message: 'Successfully created a pet',
    data: pet,
  });
};

export const patchPetController = async (req, res, next) => {
  const userId = req.user._id;
  const { petId } = req.params;
  const result = await updatePet(petId, userId, req.body);
  if (!result) {
    next(
      createHttpError(404, {
        status: 404,
        message: 'Pet not found',
        data: { message: 'Pet not found' },
      }),
    );
    return;
  }
  res.json({
    status: 200,
    message: `Successfully patched a pet!`,
    data: result.pet,
  });
};

export const deletePetController = async (req, res, next) => {
  const userId = req.user._id;
  const { petId } = req.params;
  const contact = await deletePet(petId, userId);

  if (!contact) {
    next(
      createHttpError(404, {
        status: 404,
        message: 'Pet not found',
        data: { message: 'Pet not found' },
      }),
    );

    return;
  }
  res.status(201).json({
    status: 201,
    message: 'Successfully deleted pet',
    data: contact,
  });
};
