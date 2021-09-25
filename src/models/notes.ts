import { Schema, model, Model, Document } from 'mongoose';

export interface Notes {
  title: string;
  content: string;
  author: string;
  date: Date;
}

const notesSchema = new Schema<Notes>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

export const NotesModel = model('notes', notesSchema);
export default NotesModel;
