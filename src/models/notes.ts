import { Schema, model, Model, Document } from 'mongoose';

export interface Notes {
  _id?: string;
  title: string;
  content: string;
  author?: string;
  date?: Date | string;
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
});

export const NotesModel = model('notes', notesSchema);

export default NotesModel;
