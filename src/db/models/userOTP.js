import { Schema, model } from 'mongoose';

const userOTPSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    createdAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

 const userOPTCollection = model('userOTP', userOTPSchema);
 export default userOPTCollection;