import { model, Schema } from 'mongoose';

const petsSchema = new Schema(
  {
    name: { type: String, required: true },
    birthday: {
      type: Date,
      required: true,
    },
    phone: { type: String, required: true },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female']
    },
    breed: { type: String, required: true },
    color: { type: String, required: true },
    telegram: { type: String, required: true },
    avatar: {type: String, default:""},
    owner: { type: Schema.Types.ObjectId, ref: 'users' },
  },
  { timestamps: true, versionKey: false },
);

export const PetsCollection = model('pets', petsSchema);
