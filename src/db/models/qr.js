import { model, Schema } from 'mongoose';

const qrCodeSchema = new Schema(
   {
      codeId: { type: String, unique: true },
      isAssigned: { type: Boolean, default: false },
      petId: { type: Schema.Types.ObjectId, ref: 'Pet', default: null },
      userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    },
   { timestamps: true, versionKey: false },
);

export const QRCodeCollection = model('QRCode', qrCodeSchema);
