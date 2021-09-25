import { Schema, model, Model, Document } from 'mongoose';

export interface Notes {
  title: string;
  content: string;
  author: string;
  date: Date | string;
}

const notesSchema = new Schema<Notes>({
  title: {
    type: String,
    required: [true, 'Missing Title'],
  },
  content: {
    type: String,
    required: [true, 'Missing Content'],
  },
  author: {
    type: String,
    required: [true, 'Missing Author'],
  },
  date: {
    type: Date,
    required: [true, 'Missing Date'],
  },
});

export const NotesModel = model('notes', notesSchema);

export default NotesModel;
