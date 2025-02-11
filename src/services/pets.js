import { ObjectId } from 'mongodb';
import { PetsCollection } from '../db/models/pet.js';


export const getAllPets = async () => {
  const pets = await PetsCollection.find();
  return pets;
};

export const getPetById = async (petId) => {
  const pet = await PetsCollection.findOne({ _id: new ObjectId(petId) });
  return pet;
};

export const createPet = async (pet) => {
  const petCreated = await PetsCollection.create(pet);
  return petCreated;
};

// export const updatePet = async (petId, userId, data) => {
//  const rawResult = await PetsCollection.findOneAndUpdate(
//     { _id: petId, owner: userId },
//     data,
//     {
//       new: true,
//       includeResultMetadata: true,
//     },
//   );
//   if (!rawResult || !rawResult.value) return null;
//   return {
//     pet: rawResult.value,
//     isNew: Boolean(rawResult?.lastErrorObject?.upserted),
//   };
// };

// export const updatePet = async (petId, userId, data) => {

//   const objectIdPet = typeof petId === 'string' ? new ObjectId(petId) : petId;
//   const objectIdUser = typeof userId === 'string' ? new ObjectId(userId) : userId;

//   console.log('Параметри пошуку в базі:', {
//     petId: objectIdPet,
//     userId: objectIdUser,
//   });

//   const updatedPet = await PetsCollection.findOneAndUpdate(
//     { _id: objectIdPet, owner: objectIdUser },
//     { $set: data },
//     { new: true },
//   );

//   if (!updatedPet) {
//     console.log('Документ не знайдено, переконайтесь у правильності petId та userId');
//     return null;
//   }

//   if (!updatedPet) return null;

//   return {
//     pet: updatedPet,
//     isNew: false,
//   };
// };

export const updatePet = async (petId, userId, data) => {

  const objectIdPet = typeof petId === 'string' ? new ObjectId(petId) : petId;
  const objectIdUser = typeof userId === 'string' ? new ObjectId(userId) : userId;

  console.log('Параметри пошуку в базі:', {
    petId: objectIdPet,
    userId: objectIdUser,
  });

  const existingPet = await PetsCollection.findOne({
    petId: objectIdPet,
    owner: objectIdUser
  });

  if (!existingPet) {
    console.log('Тварина не знайдена з таким petId та owner.');
    return null;
  }

  const updatedPet = await PetsCollection.findOneAndUpdate(
    { petId: objectIdPet, owner: objectIdUser },
    { $set: data },
    { new: true },
  );

  if (!updatedPet) {
    console.log('Документ не знайдено для оновлення');
    return null;
  }

  return {
    pet: updatedPet,
    isNew: false,
  };
};

export const deletePet = async (petId, userId) => {
  const result = await PetsCollection.findByIdAndDelete({
    _id: petId,
    owner: userId,
  });
  return result;
};
