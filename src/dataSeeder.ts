import { config } from 'dotenv';
config();
import notesData from './data/notes';
import connectDB from './config/db';
import NotesModel from './models/notes';
import logger, { outputToFile } from './utils/logger';

const resetData = async () => {
  try {
    await NotesModel.deleteMany({});
    await NotesModel.insertMany(notesData);
    logger.info(`Data reset Success`);
  } catch (error) {
    logger.error(`Data reset Error`);
    outputToFile('logs/errors/dataImport.json', error).then(() =>
      process.exit()
    );
  }
};

connectDB().then(resetData);
