import React, { MouseEventHandler, ReactElement } from 'react';
import './PreviewNoteCard.css';
import { Notes } from '../../../../src/models/notes';

interface Props {
  note: Notes;
  index: number;
  onPreviewClick: (index: number) => void;
}

function PreviewNoteCard({ note, index, onPreviewClick }: Props): ReactElement {
  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    onPreviewClick(index);
    event.preventDefault();
  }

  
  const processContent = (content: string) =>
    (content.length === 0 ? ' ' : content)
      .split('\n')
      .map((s, i) => <div key={i + 5}>{s}</div>);

  return (
    <div className={'preview-note'} onClick={onClick}>
      <div className='preview-title'>{note.title}</div>
      <div className='preview-content'>{processContent(note.content)}</div>
    </div>
  );
}

export default PreviewNoteCard;
