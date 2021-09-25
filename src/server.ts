import { config } from 'dotenv';
config();
import { connectDB } from './config/db';
connectDB();
import express from 'express';
import logger from './utils/logger';
import notesRouter from './routes/notes';

const app = express();

app.use(express.json());

app.use('/api/notes', notesRouter);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  logger.info(`Server is running on port ${PORT}`)
);
