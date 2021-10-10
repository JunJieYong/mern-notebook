import axios from 'axios';
import { Notes, IdedNotes } from '../models/notes';
import { v4 as uuid } from 'uuid';
import useLocal from '../config/local';

const notesAxios = axios.create({
  baseURL: '/api/notes',
});

const notesData: Notes[] = [
  {
    descendant: [
      {
        type: 'title',
        children: [{ text: 'First Note' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'Laboris anim duis duis consequat ea est dolore commodo commodo amet elit commodo dolor.' }],
      },
    ],
    author: 'System',
    date: new Date('09/26/2021'),
  },
  {
    descendant: [
      {
        type: 'title',
        children: [{ text: 'Second Note' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'Elit non commodo ipsum cupidatat pariatur cillum quis sunt.' },
          { text: 'Deserunt deserunt anim aliqua ullamco.' },
        ],
      },
    ],
    author: 'System',
    date: new Date('09/26/2021'),
  },
  {
    descendant: [
      {
        type: 'title',
        children: [{ text: 'Third Note' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'Laboris anim duis duis consequat ea est dolore commodo commodo amet elit commodo dolor.' },
          { text: 'Ut officia velit aute est nulla dolor.', bold: true },
          { text: 'Ut enim occaecat nulla tempor.', italic: true },
          { text: 'Velit qui ut eiusmod pariatur enim ut ex pariatur culpa.', underline: true },
        ],
      },
    ],
    author: 'System',
    date: new Date('09/30/2021'),
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
