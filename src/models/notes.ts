import { Schema, model, Model, Document } from 'mongoose';

export type Notes = {
  _id?: string;
  descendant: any[];
  history?: {
    redos: any[][];
    undos: any[][];
  };
  author?: string;
  date?: Date | string;
};

const notesSchema = new Schema<Notes>({
  descendant: [{}],
  history: Object,
  author: String,
  date: Date,
});

export const NotesModel = model('notes', notesSchema);

export default NotesModel;
