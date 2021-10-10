import { ReactElement, useCallback, useEffect } from 'react';
import './Home.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchNotes, notesSelector, NotesStatus } from '../../slices/noteSlice';
import { createNotesHandler } from '../../handlers/notesHandler';
import PreviewGrid from '../../components/Preview/PreviewGrid';
import DeleteNoteModal from '../../components/DeleteNoteModal';

function Home(): ReactElement {
  const dispatch = useAppDispatch();
  const { notes: allNotes, status } = useAppSelector(notesSelector);

  useEffect(() => {
    dispatch(fetchNotes());
    createNotesHandler();
  }, [dispatch]);

  //TODO: Search

  return (
    <div>
      {status === NotesStatus.Deleting && <DeleteNoteModal />}
      <br />
      <div style={{ position: 'relative' }}>All</div>
      <PreviewGrid notes={allNotes} />
    </div>
  );
}

export default Home;
