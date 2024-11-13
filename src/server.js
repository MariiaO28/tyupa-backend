import express from 'express';
import env from './utils/env.js';
import cors from 'cors';
import pino from 'pino-http';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';

const PORT = Number(env('PORT', 3000));

const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());

  // app.use(
  //     cors({
  //         origins:'*',
  //         methods:'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //         allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
  //         credentials: true,
  //     })
  // );

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.send({
      message: 'Hello World!',
    });
  });
  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
