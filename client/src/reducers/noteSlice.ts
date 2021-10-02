import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notes } from '../../../src/models/notes';

export interface NotesState {
  editingIndex?: number;
  isEditing: boolean;
  notes: Notes[];
}

const name = 'notes';

const initialState: NotesState = {
  editingIndex: -1,
  isEditing: false,
  notes: [
    {
      title: 'Hello World',
      content: 'Aliqua quis occaecat amet culpa ex.',
      author: 'System',
      date: new Date('09/26/2021'),
    },
    {
      title: 'Second Note',
      content:
        'Consectetur enim magna duis laboris veniam. Nostrud fugiat nostrud tempor occaecat aliqua labore amet minim duis aliquip enim commodo eiusmod. Irure esse ut magna voluptate veniam ut amet eu veniam fugiat enim. Non Lorem occaecat labore ad excepteur id id nulla sint exercitation. Qui anim veniam do officia labore ad laboris amet esse esse enim deserunt officia. Dolore laborum deserunt elit ut. Laboris veniam reprehenderit Lorem laboris aliqua commodo.',
      author: 'System',
      date: new Date('09/26/2021'),
    },
    {
      title: 'Third Note',
      content: 'Velit pariatur in dolor ipsum est nostrud in tempor.',
      author: 'System',
      date: new Date('09/30/2021'),
    },
    {
      title: 'Fifth Note',
      content:
        'Esse reprehenderit elit exercitation enim aliquip pariatur deserunt laborum velit nisi labore proident.',
      author: 'System',
      date: new Date('10/09/2021'),
    },
  ],
};

export const noteSlice = createSlice({
  name,
  initialState,
  reducers: {
    create: state => {
      if (!state.isEditing) {
        state.isEditing = true;
        state.editingIndex = -1;
      }
    },
    edit: (state, action: PayloadAction<{ index: number }>) => {
      if (!state.isEditing) {
        state.isEditing = true;
        state.editingIndex = action.payload.index;
      }
    },
    save: (state, action: PayloadAction<{ editedNote: Notes }>) => {
      if (state.isEditing && state.editingIndex !== undefined) {
        if (state.editingIndex > -1)
          state.notes[state.editingIndex] = action.payload.editedNote;
        else state.notes.push(action.payload.editedNote);

        state.isEditing = false;
        state.editingIndex = undefined;
      }
    },
    discard: state => {
      state.isEditing = false;
      state.editingIndex = undefined;
    },
    delete: (state, action: PayloadAction<{ index: number }>) => {
      state.notes.splice(action.payload.index);
    },
  },
});

export const {
  create: createNotes,
  edit: editNotes,
  save: saveNoteChange,
  delete: deleteNote,
  discard: discardNoteChanges,
} = noteSlice.actions;

export default noteSlice;
