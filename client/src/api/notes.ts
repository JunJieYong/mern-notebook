import axios, { AxiosResponse } from 'axios';
import { Notes, IdedNotes } from '../models/notes';

const notesAxios = axios.create({
  baseURL: '/api/notes',
});

export const getAllNotes = async () => (await notesAxios.get<IdedNotes[]>('')).data;

export const getNotesById = async (id: string) => (await notesAxios.get<IdedNotes>(`/${id}`)).data;

export const addNote = async (note: Notes) => (await notesAxios.post<Notes, AxiosResponse<IdedNotes>>('', note)).data;

export const updateNote = async (id: string, note: IdedNotes) => (await notesAxios.put<IdedNotes>(`/${id}`, note)).data;

export const deleteNote = async (id: string) => (await notesAxios.delete<IdedNotes>(`/${id}`)).data;
