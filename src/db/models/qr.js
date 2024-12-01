import { model, Schema } from 'mongoose';

const qrCodeSchema = new Schema(
   {
      codeId: { type: String, unique: true },
      isAssigned: { type: Boolean, default: false },
      qrCodeImageUrl: { type: String, required: true },
      qrCodeImagePath: { type: String, required: true },
    },
   { timestamps: true, versionKey: false },
);

export const QRCodeCollection = model('QRCode', qrCodeSchema);
