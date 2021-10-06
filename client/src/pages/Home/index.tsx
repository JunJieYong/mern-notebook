import { ReactElement, useEffect } from 'react';
import './Home.css';
import PreviewNoteCard from '../../components/PreviewNoteCard';
import EditNoteModal from '../../components/EditNoteModal';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchNotes, notesSelector, NotesStatus } from '../../slices/noteSlice';
import DeleteNoteModal from '../../components/DeleteNoteModal';
import { motion, Target, TargetAndTransition } from 'framer-motion';
import { createNotesHandler } from '../../handlers/notesHandler';
import PreviewGrid from '../../components/PreviewGrid';

function Home(): ReactElement {
  const dispatch = useAppDispatch();
  const { notes: allNotes, status } = useAppSelector(notesSelector);

  useEffect(() => {
    dispatch(fetchNotes())
    createNotesHandler();
  }, [dispatch])


  //TODO: Search
  // return (
  //   <motion.div
  //     layout 
  //     initial={gridInital}
  //     animate={gridAnimate}
  //     className='notes-grid'
  //   >
  //     {allNotes.map((note, index) => (
  //       <PreviewNoteCard {...{ key: index, note, index }} />
  //     ))}
  //     {status === NotesStatus.Editing ? <EditNoteModal /> : <div />}
  //     {status === NotesStatus.Deleting ? <DeleteNoteModal /> : <div />}
  //   </motion.div>
  // );

  return (
    <div>
      <br />
      <div style={{position: 'relative'}}>All</div>
      <PreviewGrid notes={allNotes} />
    </div>
  )
}

export default Home;
