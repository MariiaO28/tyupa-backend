import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

const isValidId = (req, res, next) => {
  const { petId } = req.params;
  if (!isValidObjectId(petId)) {
    return next(
      createHttpError(404, {
        status: 404,
        message: 'Not correct id',
        data: { message: 'Not correct id' },
      }),
    );
  }
  next();
};

export default isValidId;
