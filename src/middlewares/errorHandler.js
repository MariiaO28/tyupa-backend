import { HttpError } from 'http-errors';

const errorHandler = (err, req, res, next) => {
  console.log(err);
  console.log(err.message);

  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err.data,
    });
    next();
    return;
  }
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};

export default errorHandler;
