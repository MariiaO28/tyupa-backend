import setupServer from './server.js';
import initMongoDB from './db/initMongoDB.js';
import {QR_CREATE_DIR} from './constants/index.js';
import createDirIfNotExists from './utils/createDirIfNotExists.js';

const bootstrap = async () => {
    await initMongoDB();
    await createDirIfNotExists(QR_CREATE_DIR);
    setupServer();
};

bootstrap();
