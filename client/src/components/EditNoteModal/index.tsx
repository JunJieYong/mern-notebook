import {
  KeyboardEventHandler,
  ReactElement,
  useRef,
} from 'react';
import './EditNoteModal.css';
import { Notes } from '../../../../src/models/notes';

interface Props {
  note: Notes;
  index: number;
  onSaveNote: (note: Notes, index: number) => void;
}

function EditNoteModal({note, index, onSaveNote }: Props): ReactElement {
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const processContent = (content: string) =>
    (content.length === 0 ? ' ' : content)
      .split('\n')
      .map((s, i) => <div key={i + 5}>{s}</div>);

  const onCloseClick = () => {
    if (!titleRef.current || !contentRef.current) return;
    const newNote: Notes = {
      ...note,
      title: titleRef.current.innerText,
      content: contentRef.current.innerText
    };
    onSaveNote(newNote, index);
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
            {note.title}
          </div>
          <div
            className='edit-content'
            contentEditable='true'
            ref={contentRef}
            suppressContentEditableWarning={true}
          >
            {processContent(note.content)}
          </div>
        </div>
        <div className='edit-footer'>
          <div className='close' onClick={onCloseClick}>Close</div>
        </div>
      </form>
    </div>
  );
}

export default EditNoteModal;
