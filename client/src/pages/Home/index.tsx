import React, { ReactElement, useState } from 'react';
import './Home.css';
import PreviewNoteCard from '../../components/PreviewNoteCard';
import { Notes } from '../../../../src/models/notes';
import EditNoteModal from '../../components/EditNoteModal';

interface NotesState {
  notes: Notes[];
}

const initialState: NotesState = {
  notes: [
    {
      title: 'Hello World',
      content: 'Aliqua quis occaecat amet culpa ex.',
      author: 'System',
      date: new Date('09/26/2021'),
    },
    {
      title: 'Second Note',
      content:
        'Consectetur enim magna duis laboris veniam. \nNostrud fugiat nostrud tempor occaecat aliqua labore amet minim duis aliquip enim commodo eiusmod. \nIrure esse ut magna voluptate veniam ut amet eu veniam fugiat enim. Non Lorem occaecat labore ad excepteur id id nulla sint exercitation. \nQui anim veniam do officia labore ad laboris amet esse esse enim deserunt officia. Dolore laborum deserunt elit ut. Laboris veniam reprehenderit Lorem laboris aliqua commodo.',
      author: 'System',
      date: new Date('09/26/2021'),
    },
    {
      title: 'Third Note',
      content: 'Velit pariatur in dolor ipsum est nostrud in tempor.',
      author: 'System',
      date: new Date('09/30/2021'),
    },
    {
      title: 'Fifth Note',
      content:
        'Esse reprehenderit elit exercitation enim aliquip pariatur deserunt laborum velit nisi labore proident.',
      author: 'System',
      date: new Date('10/09/2021'),
    },
  ],
};

function Home(): ReactElement {
  const [editingIndex, setEditingIndex] = useState(0);
  const [allNotes, setAllNotes] = useState(initialState.notes);
  const [openModal, setOpenModal] = useState(false);
  const showEditModal = (index: number) => {
    console.log(index);
    setEditingIndex(index);
    setOpenModal(true);
  };
  const onModalClose = (note: Notes, index: number) => {
    const newNotes = [...allNotes];
    newNotes[index] = note;
    setAllNotes(newNotes);
    setOpenModal(false);
  };
  //TODO: Search
  return (
    <div className=''>
      <div className='notes-grid'>
        {allNotes.map((note, index) => (
          <PreviewNoteCard
            key={index}
            note={note}
            index={index}
            onPreviewClick={showEditModal}
          />
        ))}
      </div>
      {openModal ? (
        <EditNoteModal
          index={editingIndex}
          note={allNotes[editingIndex]}
          onSaveNote={onModalClose}
        />
      ) : (
        <div />
      )}
    </div>
  );
}

export default Home;
