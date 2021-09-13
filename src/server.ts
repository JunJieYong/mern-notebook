import express from 'express';
import noteRoute from './routes/api/note';
import userRoute from './routes/api/user';
import auth from './authenticate';

const expressApp = express();
expressApp.use(express.json());

expressApp.use('/api/user', userRoute);
expressApp.use('/api/note', auth, noteRoute);
