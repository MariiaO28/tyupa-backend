import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { hashCompare } from '../utils/hashFuncs.js';
import {
  createPet,
  deletePet,
  getAllPets,
  getPetById,
  updatePet,
} from '../services/pets.js';
import { QRCodeCollection } from '../db/models/qr.js';
// import { findUser } from '../services/auth.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import {PetsCollection} from '../db/models/pet.js';

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
  const { codeId } = req.body;

  const qrCode = await QRCodeCollection.findOne({ codeId });

  if (!qrCode) {
      return next(createHttpError(404, 'QR Code not found'));
  }

  if (qrCode.isAssigned) {
    if (!qrCode.petId) {
      throw createHttpError(400, 'Assigned QR Code is missing a petId.');
    }
    return res.status(400).json({
      message: 'QR Code already assigned to a pet',
    });
  }

  const pet = await createPet({ codeId, ...req.body });
  if (!pet) {
    return next(createHttpError(400, 'Something went wrong'));
  }

  qrCode.petId = pet._id;
  qrCode.isAssigned = true;
  await qrCode.save();

  res.status(201).json({
    status: 201,
    message: 'Successfully created a pet and assigned QR Code',
    data: { pet, qrCode },
  });
};

//

export const patchPetController = async (req, res, next) => {
  const { petId } = req.params;
  const { code, ...rest } = req.body;

  console.log('Patch Pet Controller - Request Body:', req.body);

  // Перевірка валідності ObjectId для petId
  if (!mongoose.Types.ObjectId.isValid(petId)) {
    return next(createHttpError(400, 'Invalid petId'));
  }

  // Логування перед запитом до бази
  console.log('Параметри пошуку в базі: ', { petId });

  // Пошук тварини за petId
  const pet = await PetsCollection.findById(petId);
  if (!pet) {
    return next(createHttpError(404, 'Pet not found'));
  }

  // Перевірка валідності PIN-коду (якщо це потрібно для доступу)
  const isEqual = await hashCompare(code, pet.pinCode); // `pinCode` має бути в документі тварини
  if (!isEqual) {
    return next(createHttpError(401, 'Unauthorized'));
  }

  // Оновлення даних тварини
  const updatedPet = await PetsCollection.findByIdAndUpdate(petId, rest, { new: true });

  res.json({
    status: 200,
    message: `Successfully patched a pet!`,
    data: updatedPet,
  });
};

// export const patchPetController = async (req, res, next) => {
//   try {
//     const userId = req.user._id;
//     const { code, ...rest } = req.body;
//     const { petId } = req.params;

//     console.log('Patch Pet Controller - User ID:', userId);
//     console.log('Patch Pet Controller - Pet ID:', petId);
//     console.log('Patch Pet Controller - Request Body:', req.body);

//     // Перевірка наявності коду
//     if (!code) {
//       throw createHttpError(400, 'PIN code is required');
//     }

//     // Перевірка валідності ID тварини
//     if (!mongoose.Types.ObjectId.isValid(petId)) {
//       throw createHttpError(400, 'Invalid pet ID');
//     }

//     // Отримання користувача
//     const user = await findUser({ _id: userId });
//     if (!user) {
//       throw createHttpError(404, 'User not found');
//     }

//     // Перевірка коду доступу
//     const isEqual = await hashCompare(code, user.password);
//     if (!isEqual) {
//       throw createHttpError(401, 'Unauthorized');
//     }

//     // Перетворення petId у ObjectId
//     const objectIdPetId = mongoose.Types.ObjectId(petId);

//     // Оновлення даних тварини
//     const result = await updatePet(objectIdPetId, userId, rest);
//     if (!result) {
//       throw createHttpError(404, 'Pet not found');
//     }

//     res.status(200).json({
//       status: 200,
//       message: `Successfully patched a pet!`,
//       data: result.pet,
//     });
//   } catch (error) {
//     console.error('Patch Pet Controller Error:', error);
//     next(error); // Передаємо помилку в middleware для обробки
//   }
// };


export const updatePetPhotoController = async (req, res, next) => {
  const { petId } = req.params;
  const userId = req.user._id;

  if (!req.file) {
    return next(createHttpError(400, 'Photo is required'));
  }

  const photoUrl= await saveFileToCloudinary(req.file, 'pets');

  const updatedPet = await updatePet(petId, userId, {avatar: photoUrl});
  if (!updatedPet) {
    return next (createHttpError(404, 'Pet is not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully uploaded pet photo',
    data: updatedPet.pet,
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

