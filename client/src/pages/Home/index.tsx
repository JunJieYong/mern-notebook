import { ReactElement, useEffect } from 'react';
import './Home.css';
import PreviewNoteCard from '../../components/PreviewNoteCard';
import EditNoteModal from '../../components/EditNoteModal';
import {  useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchNotes, notesSelector, NotesStatus } from '../../slices/noteSlice';
import DeleteNoteModal from '../../components/DeleteNoteModal';
import { createNotesHandler } from '../../handlers/notesHandler';

function Home(): ReactElement {
  const dispatch = useAppDispatch();
  const { notes: allNotes, status } = useAppSelector(notesSelector);

  useEffect(() => {
    dispatch(fetchNotes())
    createNotesHandler();
  }, [dispatch])

  //TODO: Search
  return (
    <div className=''>
      <div className='notes-grid'>
        {allNotes.map((note, index) => (
          <PreviewNoteCard {...{ key: index, note, index }} />
        ))}
      </div>
      {status === NotesStatus.Editing ? <EditNoteModal /> : <div />}
      {status === NotesStatus.Deleting ? <DeleteNoteModal /> : <div />}
    </div>
  );
}

export default Home;
