import NotesModel, { Notes } from '../models/notes';
import { Request, Response } from 'express';
import logger from '../utils/logger';

interface IdParam {
  id: string;
}

export const getAllNotes = async (req: Request, res: Response) => {
  const notes = await NotesModel.find({});
  res.json(notes);
};

export const getNotesById = async (req: Request<IdParam>, res: Response) => {
  const note = await NotesModel.findById(req.params.id);
  res.json(note);
};

export const createNote = async (
  req: Request<never, never, Notes>,
  res: Response
) => {
  const note = await NotesModel.create(req.body);
  res.json(note);
};

export const updateNote = async (
  req: Request<IdParam, never, Partial<Notes>>,
  res: Response
) => {
  const note = await NotesModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(note);
};

export const deleteNote = async (req: Request<IdParam>, res: Response) => {
  const note = await NotesModel.findByIdAndDelete(req.params.id);
  res.json(note);
};
