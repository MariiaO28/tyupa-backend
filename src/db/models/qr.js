import { model, Schema } from 'mongoose';

const qrCodeSchema = new Schema(
   {
      codeId: { type: Schema.Types.ObjectId, unique: true },
      isAssigned: { type: Boolean, default: false },
      petId: { type: Schema.Types.ObjectId, ref: 'pets', default: null },
      userId: { type: Schema.Types.ObjectId, ref: 'users', default: null },
      qrCodeImageUrl: { type: String, required: true },
      qrCodeImagePath: { type: String, required: true },
    },
   { timestamps: true, versionKey: false },
);

export const QRCodeCollection = model('QRCode', qrCodeSchema);
