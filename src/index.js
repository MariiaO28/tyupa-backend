import setupServer from './server.js';
import initMongoDB from './db/initMongoDB.js';

const bootstrap = async () => {
    await initMongoDB();
    setupServer();
};

bootstrap();
