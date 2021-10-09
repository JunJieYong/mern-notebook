import { v4 as uuid } from 'uuid';
import socket from '../app/socket-io';
import { store } from '../app/store';
import useLocal from '../config/local';
import { IdedNotes } from '../models/notes';
import { serverNoteChange, serverNoteDelete } from '../slices/noteSlice';

export const createNotesHandler = () => {
  if (!useLocal) {
    socket.on('notes/change', (note: IdedNotes) => {
      store.dispatch(serverNoteChange(note));
    });

    socket.on('notes/delete', (note: IdedNotes) => {
      store.dispatch(serverNoteDelete(note));
    });
  }
};

(window as any).timedCreate = (ms = 5000) =>
  ((window as any).intervalId = setInterval(() => {
    // !Deprecated
    // store.dispatch(
    //   serverNoteChange({
    //     _id: uuid(),
    //     title: 'Second Note',
    //     content: 'Consectetur enim magna duis laboris veniam.',
    //     author: 'System',
    //     date: '09/26/2021',
    //   }),
    // );
  }, ms));
