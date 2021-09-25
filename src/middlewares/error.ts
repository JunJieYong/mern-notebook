import { ErrorRequestHandler } from 'express';
import { Error as MongooseError } from 'mongoose';
import { outputToFile } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let message = 'Server Error',
    code = 500;
  if (err instanceof Error) {
    if (
      err instanceof MongooseError.CastError ||
      err instanceof MongooseError.ValidationError
    ) {
      code = 400;
    }
    message = err.message;
  }
  res.status(code).json({ message });
  const name = `error${Date.now()}.json`;
  outputToFile(`logs/errors/${name}`, err);
};

export default errorHandler;
