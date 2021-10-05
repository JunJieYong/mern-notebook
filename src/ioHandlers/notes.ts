import { Server, Socket } from 'socket.io';
import NotesModel, { Notes } from '../models/notes';

interface NotesListenEvents {
  'notes/create': (note: Notes) => void;
  'notes/save': (note: Required<Notes>) => void;
  'notes/delete': (id: string) => void;
}

export const registerNotesHandler = (io: Server, socket: Socket<NotesListenEvents>) => {
  socket.on('notes/create', note => NotesModel.create(note).then(note => io.emit('notes/change', note)));

  socket.on('notes/save', note => NotesModel.findByIdAndUpdate(note._id).then(note => io.emit('notes/change', note)));

  socket.on('notes/delete', id => NotesModel.findByIdAndDelete(id).then(note => io.emit('notes/delete', note)));
};
