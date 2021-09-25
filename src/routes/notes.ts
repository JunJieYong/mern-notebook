import { Router } from 'express';
import { getAllNotes, getNotesById } from '../controllers/notes';
const router = Router();

router.get('/', getAllNotes);

router.get('/:id', getNotesById);

export default router;
