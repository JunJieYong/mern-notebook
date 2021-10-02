import { ReactElement } from 'react';
import './Home.css';
import PreviewNoteCard from '../../components/PreviewNoteCard';
import EditNoteModal from '../../components/EditNoteModal';
import { useAppSelector } from '../../app/hooks';
import { notesSelector } from '../../reducers/noteSlice';

function Home(): ReactElement {
  const { notes: allNotes, isEditing } = useAppSelector(notesSelector);

  //TODO: Search
  return (
    <div className=''>
      <div className='notes-grid'>
        {allNotes.map((note, index) => (
          <PreviewNoteCard {...{ key: index, note, index }} />
        ))}
      </div>
      {isEditing ? <EditNoteModal /> : <div />}
    </div>
  );
}

export default Home;
