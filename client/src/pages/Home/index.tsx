import { ReactElement, useEffect, useState } from 'react';
import './Home.css';
import PreviewNoteCard from '../../components/PreviewNoteCard';
import EditNoteModal from '../../components/EditNoteModal';
import Popup from '../../components/Popup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { notesSelector, saveNoteChange } from '../../reducers/noteSlice';
import DeleteNoteModal from '../../components/DeleteNoteModal';

function Home(): ReactElement {
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useAppDispatch();
  const { notes: allNotes, isEditing, isDeleting } = useAppSelector(notesSelector);

  useEffect(() => {
    setShowPopup(isEditing);
  }, [showPopup, isEditing]);

  //TODO: Search
  return (
    <div className=''>
      <div className='notes-grid'>
        {allNotes.map((note, index) => (
          <PreviewNoteCard {...{ key: index, note, index }} />
        ))}
      </div>
      {isDeleting ? <DeleteNoteModal /> : <div />}
      <Popup open={isEditing} onBackgroundClick={() => isEditing && dispatch(saveNoteChange({}))}>
        {isEditing ? <EditNoteModal /> : <div />}
      </Popup>
    </div>
  );
}

export default Home;
