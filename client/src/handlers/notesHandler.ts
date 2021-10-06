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
