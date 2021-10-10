import { io } from 'socket.io-client';
import useLocal from '../config/local';

export const socket = io({
  autoConnect: false,
});

if (!useLocal) socket.connect();

export default socket;
