import { KeyboardEventHandler, ReactElement, useRef } from 'react';
import './EditNoteModal.css';
import { Notes } from '../../../../src/models/notes';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { notesSelector, saveNoteChange } from '../../reducers/noteSlice';

function EditNoteModal(): ReactElement {
  const dispatch = useAppDispatch();
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { notes: allNotes, editingIndex } = useAppSelector(notesSelector);
  if (editingIndex === undefined) return <div />;
  const oldNote = allNotes[editingIndex];

  const processContent = (content: string) =>
    (content.length === 0 ? ' ' : content)
      .split('\n')
      .map((s, i) => <div key={i + 5}>{s}</div>);

  const onSaveClick = () => {
    if (!titleRef.current || !contentRef.current) return;
    const editedNote: Notes = {
      ...oldNote,
      title: titleRef.current.innerText,
      content: contentRef.current.innerText,
    };
    dispatch(saveNoteChange({ editedNote }));
  };

  const suppressLineBreak: KeyboardEventHandler = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const firstChild = contentRef.current?.children[0] as
        | HTMLDivElement
        | undefined;
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
  return (
    <div className='modal-background'>
      <form className='form-modal'>
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
          <div className='close' onClick={onSaveClick}>
            Save
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditNoteModal;
