import fs from 'fs';
import path from 'node:path';

export const MONGO_DB = {
  MONGODB_USER: 'MONGODB_USER',
  MONGODB_PASSWORD: 'MONGODB_PASSWORD',
  MONGODB_URL: 'MONGODB_URL',
  MONGODB_DB: 'MONGODB_DB',
};
export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const MONTH = 30 * 24 * 60 * 60 * 1000;

export const QR_CODE_DIR = './qr-codes';
if (!fs.existsSync(QR_CODE_DIR)) {
  fs.mkdirSync(QR_CODE_DIR, { recursive: true });
}

export const QR_CREATE_DIR = path.join(process.cwd(), 'qr-codes');

// export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');

// export const UPLOAD_DIR = path.join(process.cwd(), 'upload');
