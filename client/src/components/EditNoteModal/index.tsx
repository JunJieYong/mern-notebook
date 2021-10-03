import { KeyboardEventHandler, MouseEventHandler, ReactElement, useEffect, useRef, useState } from 'react';
import './EditNoteModal.css';
import { Notes } from '../../../../src/models/notes';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  createEmptyNote,
  discardNoteChanges,
  notesSelector,
  saveNoteChange,
} from '../../reducers/noteSlice';

function EditNoteModal(): ReactElement {
  const dispatch = useAppDispatch();
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const { notes: allNotes, editingIndex, triggerSave } = useAppSelector(notesSelector);
  const oldNote = editingIndex !== undefined  ? editingIndex !== -1 ? allNotes[editingIndex] : createEmptyNote() : undefined;

  const processContent = (content: string) =>
    (content.length === 0 ? ' ' : content).split('\n').map((s, i) => <div key={i + 5}>{s}</div>);

  const cancelDiscard: MouseEventHandler<HTMLFormElement> = (event) => {
    if (confirmDiscard) setConfirmDiscard(false);
    event.stopPropagation();
  };

  const onSaveClick = () => {
    if (!oldNote) return;
    if (!titleRef.current || !contentRef.current) return;
    const title = titleRef.current.innerText;
    const content = contentRef.current.innerText;
    if (title === '' || content === '') {
      //TODO: Add Error Prompt;
      alert('Empty title or content');
    } else {
      const editedNote: Notes = { ...oldNote, title, content };
      dispatch(saveNoteChange({ editedNote }));
    }
  };

  useEffect(() => {
    if (triggerSave) onSaveClick();
  }, [triggerSave]);

  const onDiscardClick = () => {
    if (!confirmDiscard) setConfirmDiscard(true);
    else {
      dispatch(discardNoteChanges());
    }
  };

  const suppressLineBreak: KeyboardEventHandler = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const firstChild = contentRef.current?.children[0] as HTMLDivElement | undefined;
      if (firstChild) {
        const range = document.createRange(),
          sel = document.getSelection();
        range.setStart(firstChild, 0);
        range.collapse();

        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  };
  
  if (oldNote === undefined) return <div />;
  return (
    <form className='form-modal' onClick={cancelDiscard}>
      <div className='edit-notes'>
        <div
          className='edit-title'
          contentEditable={true}
          suppressContentEditableWarning={true}
          onKeyPress={suppressLineBreak}
          ref={titleRef}
        >
          {oldNote.title}
        </div>
        <div
          className='edit-content'
          contentEditable='true'
          ref={contentRef}
          suppressContentEditableWarning={true}
        >
          {processContent(oldNote.content)}
        </div>
      </div>
      <div className='edit-footer'>
        <div className='save' onClick={onSaveClick}>
          Save
        </div>
        <div className='discard-confirm'>{confirmDiscard ? 'Confirm?' : ''}</div>
        <div className='discard-no'>{confirmDiscard ? 'No' : ''}</div>
        <div className='discard' onClick={onDiscardClick}>
          {confirmDiscard ? 'Yes' : 'Discard Changes'}
        </div>
        <div className='discard-revert'></div>
      </div>
    </form>
  );
}

export default EditNoteModal;
