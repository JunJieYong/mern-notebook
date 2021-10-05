import { config } from 'dotenv';
config();
import { connectDB } from './config/db';
import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import errorHandler from './middlewares/error';
import notesRouter from './routes/notes';
import logger from './utils/logger';
import { registerNotesHandler } from './ioHandlers/notes';

connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());

app.use('/api/notes', notesRouter);
app.use(errorHandler);

io.on('connection', socket => {
  registerNotesHandler(io, socket);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => res.redirect('/index.html'));
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
