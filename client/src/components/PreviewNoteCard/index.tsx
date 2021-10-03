import React, { MouseEventHandler, ReactElement } from 'react';
import './PreviewNoteCard.css';
import { Notes } from '../../../../src/models/notes';
import { useAppDispatch } from '../../app/hooks';
import { deleteNote, editNotes } from '../../reducers/noteSlice';
import { BiTrash } from 'react-icons/bi';

interface Props {
  note: Notes;
  index: number;
}

function PreviewNoteCard({ note, index }: Props): ReactElement {
  const dispatch = useAppDispatch();
  const onClick: MouseEventHandler<HTMLDivElement> = event => {
    dispatch(editNotes({ index }));
    event.preventDefault();
  };

  const onTrashClick: MouseEventHandler<HTMLDivElement> = event => {};

  const processContent = (content: string) =>
    (content.length === 0 ? ' ' : content).split('\n').map((s, i) => <div key={i + 5}>{s}</div>);

  return (
    <div className={'preview-note'} onClick={onClick}>
      <div className='preview-header'>
        <div className='preview-title'>{note.title}</div>
        <div className='trash' onClick={onTrashClick}>
          <BiTrash onClick={(e) => {dispatch(deleteNote({index})); e.stopPropagation()}} />
        </div>
      </div>
      <div className='preview-content'>{processContent(note.content)}</div>
    </div>
  );
}

export default PreviewNoteCard;
