import setupServer from './server.js';
import initMongoDB from './db/initMongoDB.js';
import {QR_CREATE_DIR, TEMP_UPLOAD_DIR, UPLOAD_DIR} from './constants/index.js';
import createDirIfNotExists from './utils/createDirIfNotExists.js';

const bootstrap = async () => {
    await initMongoDB();
    await createDirIfNotExists(QR_CREATE_DIR);
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    setupServer();
};

bootstrap();
