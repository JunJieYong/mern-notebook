import { Schema, model, Model, Document } from 'mongoose';

export type Notes = {
  _id?: string;
  descendant: any[];
  history?: any[];
  author?: string;
  date?: Date | string;
};

const notesSchema = new Schema<Notes>({
  _id: String,
  descendant: [{}],
  history: [{}],
  author: String,
  date: Date,
});

export const NotesModel = model('notes', notesSchema);

export default NotesModel;
