import mongoose from 'mongoose';
import logger, { outputToFile } from '../utils/logger';

const { MONGO_URI } = process.env;

export const connectDB = async () => {
  try {
    if (!MONGO_URI) throw 'Missing ENV: MONGO_URI';
    await mongoose.connect(MONGO_URI);

    logger.verbose('MongoDB Connection Success');
  } catch (e) {
    logger.error('MongoDB Connection Fail');
    outputToFile('logs/errors/mongoose.json', e);
    process.exit();
  }
};

export default connectDB;
