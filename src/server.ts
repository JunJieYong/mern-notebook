import { config } from 'dotenv';
config();
import { connectDB } from './config/db';
import express from 'express';
import errorHandler from './middlewares/error';
import notesRouter from './routes/notes';
import logger from './utils/logger';

connectDB();

const app = express();

app.use(express.json());

app.use('/api/notes', notesRouter);
app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => res.redirect('/index.html'));
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
