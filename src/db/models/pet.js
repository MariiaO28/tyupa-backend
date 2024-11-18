import { model, Schema } from 'mongoose';

const petsSchema = new Schema(
  {
    name: { type: String, required: true },
    birthday: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    breed: { type: String, required: true },
    color: { type: String, required: true },
    telegram: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'users' },
  },
  { timestamps: true, versionKey: false },
);

export const PetsCollection = model('pets', petsSchema);
