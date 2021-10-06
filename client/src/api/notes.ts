import axios from 'axios';
import { Notes, IdedNotes } from '../models/notes';
import { v4 as uuid } from 'uuid';
import useLocal from '../config/local';

const notesAxios = axios.create({
  baseURL: '/api/notes',
});

const notesData: Notes[] = [
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
    content: 'Esse reprehenderit elit exercitation enim aliquip pariatur deserunt laborum velit nisi labore proident.',
    author: 'System',
    date: new Date('10/09/2021'),
  },
];

const local = {
  getAll: (): IdedNotes[] => JSON.parse(localStorage.getItem('allNote') ?? '[]'),
  getOne: (id: string) => local.getAll().find(({ _id }) => _id === id),
  createNote: ({ ...note }: Notes) => {
    const a = local.getAll();
    note._id = uuid();
    a.push(note as IdedNotes);
    localStorage.setItem('allNote', JSON.stringify(a));
    return note as IdedNotes;
  },
  update: ({ ...note }: IdedNotes) => {
    const a = local.getAll(),
      i = a.findIndex(({ _id }) => _id === note._id);
    a.splice(i, 1, note);
    localStorage.setItem('allNote', JSON.stringify(a));
    return note;
  },
  delete: (id: string) => {
    const a = local.getAll(),
      i = a.findIndex(({ _id }) => _id === id),
      o = a.splice(i, 1);
    localStorage.setItem('allNote', JSON.stringify(a));
    return o[0];
  },
};

if (useLocal) {
  (window as any).resetData = (purge = true) => {
    if (purge) localStorage.setItem('allNote', '[]');
    notesData.forEach(local.createNote);
  };
  (window as any).localOps = local;
}

export const getAllNotes = async () => (useLocal ? local.getAll() : (await notesAxios.get<IdedNotes[]>('')).data);

export const getNotesById = async (id: string) =>
  useLocal ? local.getOne(id) : (await notesAxios.get<IdedNotes>(`/${id}`)).data;

export const addNote = async (note: Notes) =>
  useLocal ? local.createNote(note) : (await notesAxios.post<IdedNotes>('', note as IdedNotes)).data;

export const updateNote = async (id: string, note: IdedNotes) =>
  useLocal ? local.update(note) : (await notesAxios.put<IdedNotes>(`/${id}`, note)).data;

export const deleteNote = async (id: string) =>
  useLocal ? local.delete(id) : (await notesAxios.delete<IdedNotes>(`/${id}`)).data;
