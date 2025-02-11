import { model, Schema } from 'mongoose';
// import { ObjectId } from 'mongodb';

const petsSchema = new Schema(
  {
    codeId: { type: String, required: true },
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
    avatar: {type: String, default:"https://res.cloudinary.com/dpfbagody/image/upload/v1736084620/TYUPASVG_2_m676es.png"}
    // userId: { type: ObjectId, ref: 'User', required: false }
  },
  { timestamps: true, versionKey: false },
);

export const PetsCollection = model('pets', petsSchema);
