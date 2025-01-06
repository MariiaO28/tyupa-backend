import { PetsCollection } from '../db/models/pet.js';


export const getAllPets = async () => {
  const pets = await PetsCollection.find();
  return pets;
};

export const getPetById = async (petId) => {
  const pet = await PetsCollection.find({ _id: petId });
  return pet;
};

export const createPet = async (pet) => {
  console.log("Received pet data:", pet);
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

export const updatePet = async (petId, userId, data) => {
  const updatedPet = await PetsCollection.findOneAndUpdate(
    { _id: petId, owner: userId },
    { $set: data },
    { new: true },
  );

  if (!updatedPet) return null;

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
