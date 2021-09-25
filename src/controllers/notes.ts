import NotesModel from '../models/notes';
import { Request, Response } from 'express';
import logger from '../utils/logger';

interface IdParam {
  id: string;
}

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await NotesModel.find({});
    res.json(notes);
  } catch (e) {
    if (e instanceof Error) logger.error(e.message);
    else if (typeof e === 'string') logger.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getNotesById = async (req: Request<IdParam>, res: Response) => {
  try {
    const note = await NotesModel.findById(req.params.id);
    res.json(note);
  } catch (e) {
    if (e instanceof Error) logger.error(e.message);
    else if (typeof e === 'string') logger.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};
