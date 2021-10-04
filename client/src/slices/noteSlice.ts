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
  editingNote?: IdedNotes;
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
  title: '',
  content: '',
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
export const saveNote = createAsyncThunk(`${name}/saveNewNote`, async ({ note }: { note: IdedNotes }) =>
  note._id === newNoteTempId ? addNote({ ...note, _id: undefined }) : updateNote(note._id, note),
);
export const removeNote = createAsyncThunk(`${name}/`, ({ _id }: { _id: string }) => deleteNote(_id));

type PossibleRejection = typeof fetchNotes.rejected | typeof saveNote.rejected | typeof removeNote.rejected;
//Slice
const thunkRejectHandler: CaseReducer<NotesState, ReturnType<PossibleRejection>> = (state, action) => {
  state.status = NotesStatus.Errored;
  const error = action.error;
  if (axios.isAxiosError(error)) {
  }
};

export const noteSlice = createSlice({
  name,
  initialState,
  reducers: {
    create: state => {
      if (!state.editingNote) {
        state.editingNote = createEmptyNote();
      }
    },
    edit: (state, action: PayloadAction<{ id: string }>) => {
      if (!state.editingNote) {
        state.status = NotesStatus.Editing;
        state.editingNote = getNoteById(state.notes, action.payload.id);
      }
    },
    discard: state => void (state.status = NotesStatus.Idling),
    confirmDelete: (state, action: PayloadAction<{ id: string }>) => {
      state.status = NotesStatus.Deleting;
      state.deletingId = action.payload.id;
    },
    cancelState: state => void (state.status = NotesStatus.Idling),
  },
  extraReducers: builder =>
    builder
      .addCase(fetchNotes.pending, state => void (state.status = NotesStatus.Fetching))
      .addCase(fetchNotes.fulfilled, (state, action) => void (state.notes = action.payload))
      .addCase(fetchNotes.rejected, thunkRejectHandler)

      .addCase(saveNote.pending, state => void (state.status = NotesStatus.Saving))
      .addCase(saveNote.fulfilled, (state, { payload: note }) => {
        const index = indexNoteById(state.notes, note._id);
        state.notes.splice(index, 1, note);
        state.editingNote = undefined;
        state.status = NotesStatus.Idling;
      })
      .addCase(saveNote.rejected, thunkRejectHandler)

      .addCase(removeNote.pending, state => void (state.status = NotesStatus.Deleting))
      .addCase(removeNote.fulfilled, (state, { payload: note }) => {
        const index = indexNoteById(state.notes, note._id);
        state.notes.splice(index, 1);
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
} = noteSlice.actions;

export const notesSelector = (state: RootState) => state.notes;

export default noteSlice;
