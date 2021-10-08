import { ReactElement, useCallback, useEffect } from 'react';
import './Home.css';
import PreviewNoteCard from '../../components/PreviewNoteCard';
import EditNoteModal from '../../components/EditNoteModal';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchNotes, notesSelector, NotesStatus } from '../../slices/noteSlice';
import DeleteNoteModal from '../../components/DeleteNoteModal';
import { motion, Target, TargetAndTransition } from 'framer-motion';
import { createNotesHandler } from '../../handlers/notesHandler';
import PreviewGrid from '../../components/Preview/PreviewGrid';
import PreviewCard from '../../components/Preview/PreviewCard';
import Popup from '../../components/Popup';

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

  // return (
  //   <div>
  //     <br />
  //     <div style={{position: 'relative'}}>All</div>
  //     <PreviewGrid notes={allNotes} />
  //   </div>
  // )

  const cb = useCallback( () => {}, [] )

  return (
    <Popup open={true}>
      <PreviewCard  
        note={allNotes[0]}
        initialY={0}
        visible={true}
        width={240}
        heightCallback={cb}
      />
    </Popup>
  )
}

export default Home;
