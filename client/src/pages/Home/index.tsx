import { ReactElement, useEffect } from 'react';
import './Home.css';
import PreviewNoteCard from '../../components/PreviewNoteCard';
import EditNoteModal from '../../components/EditNoteModal';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchNotes, notesSelector, NotesStatus } from '../../slices/noteSlice';
import DeleteNoteModal from '../../components/DeleteNoteModal';
import { motion, Target, TargetAndTransition } from 'framer-motion';
import { createNotesHandler } from '../../handlers/notesHandler';

function Home(): ReactElement {
  const dispatch = useAppDispatch();
  const { notes: allNotes, status } = useAppSelector(notesSelector);

  useEffect(() => {
    dispatch(fetchNotes())
    createNotesHandler();
  }, [dispatch])

  const gridInital: Target = {
    display: 'flex',
    flexFlow: 'row wrap'
  }

  const gridAnimate: TargetAndTransition  = {
    
  }

  //TODO: Search
  return (
    <motion.div
      layout 
      initial={gridInital}
      animate={gridAnimate}
      className='notes-grid'
    >
      {allNotes.map((note, index) => (
        <PreviewNoteCard {...{ key: index, note, index }} />
      ))}
      {status === NotesStatus.Editing ? <EditNoteModal /> : <div />}
      {status === NotesStatus.Deleting ? <DeleteNoteModal /> : <div />}
    </motion.div>
  );
}

export default Home;
