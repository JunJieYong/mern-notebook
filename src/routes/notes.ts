import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNotesById,
  updateNote,
} from '../controllers/notes';
const router = Router();

router.route('/').get(getAllNotes).post(createNote);

router.route('/:id').get(getNotesById).put(updateNote).delete(deleteNote);

export default router;
