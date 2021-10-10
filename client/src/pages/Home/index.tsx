import { ReactElement, useCallback, useEffect } from 'react';
import './Home.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchNotes, notesSelector } from '../../slices/noteSlice';
import { createNotesHandler } from '../../handlers/notesHandler';
import PreviewGrid from '../../components/Preview/PreviewGrid';

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
      <br />
      <div style={{ position: 'relative' }}>All</div>
      <PreviewGrid notes={allNotes} />
    </div>
  );
}

export default Home;
