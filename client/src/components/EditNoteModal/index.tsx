// !Deprecated
export {}
// import { KeyboardEventHandler, MouseEventHandler, ReactElement, useRef, useState } from 'react';
// import './EditNoteModal.css';
// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { discardNoteChanges, notesSelector, saveNote } from '../../slices/noteSlice';
// import { IdedNotes } from '../../models/notes';
// import Popup from '../Popup';

// function EditNoteModal(): ReactElement {
//   const dispatch = useAppDispatch();
//   const titleRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);
//   const [confirmDiscard, setConfirmDiscard] = useState(false);
//   const { editingNote } = useAppSelector(notesSelector);
//   if (!editingNote) return <div />;

//   const processContent = (content: string) =>
//     (content.length === 0 ? ' ' : content).split('\n').map((s, i) => <div key={i + 5}>{s}</div>);

//   const cancelDiscard: MouseEventHandler<HTMLFormElement> = event => {
//     if (confirmDiscard) setConfirmDiscard(false);
//     event.stopPropagation();
//   };

//   const onSaveClick = () => {
//     if (!editingNote) return;
//     if (!titleRef.current || !contentRef.current) return;
//     const title = titleRef.current.innerText;
//     const content = contentRef.current.innerText;
//     if (title === '' || content === '') {
//       //TODO: Add Error Prompt;
//       alert('Empty title or content');
//     } else {
//       const editedNote: IdedNotes = { ...editingNote, title, content };
//       dispatch(saveNote({ note: editedNote }));
//     }
//   };

//   const onDiscardClick = () => {
//     if (!confirmDiscard) setConfirmDiscard(true);
//     else {
//       dispatch(discardNoteChanges());
//     }
//   };

//   const suppressLineBreak: KeyboardEventHandler = event => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       const firstChild = contentRef.current?.children[0] as HTMLDivElement | undefined;
//       if (firstChild) {
//         const range = document.createRange(),
//           sel = document.getSelection();
//         range.setStart(firstChild, 0);
//         range.collapse();

//         sel?.removeAllRanges();
//         sel?.addRange(range);
//       }
//     }
//   };

//   if (editingNote === undefined) return <div />;
//   return (
//     <Popup open={true} onBackgroundClick={onSaveClick}>
//       <form className='form-modal' onClick={cancelDiscard}>
//         <div className='edit-notes'>
//           <div
//             className='edit-title'
//             contentEditable={true}
//             suppressContentEditableWarning={true}
//             onKeyPress={suppressLineBreak}
//             ref={titleRef}
//           >
//             {editingNote.title}
//           </div>
//           <div className='edit-content' contentEditable='true' ref={contentRef} suppressContentEditableWarning={true}>
//             {processContent(editingNote.content)}
//           </div>
//         </div>
//         <div className='edit-footer'>
//           <div className='save' onClick={onSaveClick}>
//             Save
//           </div>
//           <div className='discard-confirm'>{confirmDiscard ? 'Confirm?' : ''}</div>
//           <div className='discard-no'>{confirmDiscard ? 'No' : ''}</div>
//           <div className='discard' onClick={onDiscardClick}>
//             {confirmDiscard ? 'Yes' : 'Discard Changes'}
//           </div>
//           <div className='discard-revert'></div>
//         </div>
//       </form>
//     </Popup>
//   );
// }

// export default EditNoteModal;
