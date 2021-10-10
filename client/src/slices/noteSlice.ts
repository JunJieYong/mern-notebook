import { CaseReducer, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IdedNotes } from '../models/notes';
import { addNote, deleteNote, getAllNotes, updateNote } from '../api/notes';
import { RootState } from '../app/store';
import axios from 'axios';

export enum NotesStatus {
  Fetching,
  Idling,
  Editing,
  Deleting,
  Saving,
  Errored,
}

export interface NotesState {
  status: NotesStatus;
  editingId?: string;
  deletingId?: string;
  notes: IdedNotes[];
  errors?: any;
}

const name = 'notes';
export const newNoteTempId = 'new';
export const indexNoteById = (notes: IdedNotes[], id: string) => notes.findIndex(({ _id }) => _id === id);
export const getNoteById = (notes: IdedNotes[], id: string) => notes.find(({ _id }) => _id === id);
export const createEmptyNote = (): IdedNotes => ({
  _id: newNoteTempId,
  descendant: [{ type: 'title', children: [{ text: '' }] }],
  author: '',
  date: '',
});

const initialState: NotesState = {
  status: NotesStatus.Idling,
  notes: [],
};

//Thunks
export const fetchNotes = createAsyncThunk(`${name}/fetchNotes`, () => getAllNotes());
// export const  = createAsyncThunk(`${name}/${}`, getNotesById)
export const saveNote = createAsyncThunk(`${name}/saveNewNote`, async (note: IdedNotes) =>
  note._id === newNoteTempId ? addNote({ ...note, _id: undefined }) : updateNote(note._id, note),
);
export const removeNote = createAsyncThunk(`${name}/removeNote`, ({ _id }: { _id: string }) => deleteNote(_id));

type PossibleRejection = typeof fetchNotes.rejected | typeof saveNote.rejected | typeof removeNote.rejected;
//Slice
const thunkRejectHandler: CaseReducer<NotesState, ReturnType<PossibleRejection>> = (state, action) => {
  state.status = NotesStatus.Errored;
  const error = action.error;
  if (axios.isAxiosError(error)) {
    alert('Error');
  }
};

export const noteSlice = createSlice({
  name,
  initialState,
  reducers: {
    create: state => {
      if (state.status === NotesStatus.Idling) {
        state.status = NotesStatus.Editing;
        state.editingId = newNoteTempId;
        state.notes.push(createEmptyNote());
      }
    },
    edit: (state, action: PayloadAction<{ _id: string }>) => {
      if (state.status === NotesStatus.Idling) {
        state.status = NotesStatus.Editing;
        state.editingId = action.payload._id;
      }
    },
    discard: state => void (state.status = NotesStatus.Idling),
    confirmDelete: (state, action: PayloadAction<{ id: string }>) => {
      if (state.status === NotesStatus.Idling) {
        state.status = NotesStatus.Deleting;
        state.deletingId = action.payload.id;
      }
    },
    cancelState: state => void (state.status = NotesStatus.Idling),
    clearNew: state => void (state.notes = state.notes.filter(note => note._id != newNoteTempId)),
    serverChange: (state, action: PayloadAction<IdedNotes>) => {
      const index = indexNoteById(state.notes, action.payload._id);
      if (index === -1) {
        state.notes.push(action.payload);
      } else {
        if (state.editingId === action.payload._id) state.status = NotesStatus.Idling;
        state.notes.splice(index, 1, action.payload);
      }
    },
    serverDelete: (state, action: PayloadAction<{ _id: string }>) => {
      const index = indexNoteById(state.notes, action.payload._id);
      if (index !== -1) {
        if (state.deletingId === action.payload._id) {
          state.deletingId = undefined;
          state.status = NotesStatus.Idling;
        }
        state.notes.splice(index, 1);
      }
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchNotes.pending, state => void (state.status = NotesStatus.Fetching))
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = NotesStatus.Idling;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, thunkRejectHandler)

      .addCase(saveNote.pending, state => void (state.status = NotesStatus.Saving))
      .addCase(saveNote.fulfilled, (state, { payload: note }) => {
        state.status = NotesStatus.Idling;
        const index = indexNoteById(state.notes, note._id);
        if (index === -1) state.notes.push(note);
        else state.notes.splice(index, 1, note);
      })
      .addCase(saveNote.rejected, thunkRejectHandler)

      .addCase(removeNote.pending, state => void (state.status = NotesStatus.Deleting))
      .addCase(removeNote.fulfilled, (state, { payload: note }) => {
        const index = indexNoteById(state.notes, note._id);
        if (index !== -1) {
          state.deletingId = undefined;
          state.status = NotesStatus.Idling;
          state.notes.splice(index, 1);
        }
        state.status = NotesStatus.Idling;
      })
      .addCase(removeNote.rejected, thunkRejectHandler),
});

export const {
  create: createNote,
  edit: editNotes,
  confirmDelete: confirmDeleteNote,
  discard: discardNoteChanges,
  cancelState: cancelNoteState,
  serverChange: serverNoteChange,
  serverDelete: serverNoteDelete,
  clearNew: clearNewNote,
} = noteSlice.actions;

export const notesSelector = (state: RootState) => state.notes;

export default noteSlice;
