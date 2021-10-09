// !Deprecated
export {}
// import { MouseEventHandler, ReactElement } from 'react';
// import './PreviewNoteCard.css';
// import { useAppDispatch } from '../../app/hooks';
// import { confirmDeleteNote, editNotes } from '../../slices/noteSlice';
// import { BiTrash } from 'react-icons/bi';
// import { IdedNotes } from '../../models/notes';

// interface Props {
//   note: IdedNotes;
//   index: number;
// }

// function PreviewNoteCard({ note }: Props): ReactElement {
//   const dispatch = useAppDispatch();
//   const onClick: MouseEventHandler<HTMLDivElement> = event => {
//     dispatch(editNotes({ id: note._id }));
//     event.preventDefault();
//   };

//   const onTrashClick: MouseEventHandler<HTMLDivElement> = event => {};

//   const processContent = (content: string) =>
//     (content.length === 0 ? ' ' : content).split('\n').map((s, i) => <div key={i + 5}>{s}</div>);

//   return (
//     <div className={'preview-note'} onClick={onClick}>
//       <div className='preview-header'>
//         <div className='preview-title'>{note.title}</div>
//         <div className='trash' onClick={onTrashClick}>
//           <BiTrash
//             onClick={e => {
//               dispatch(confirmDeleteNote({ id: note._id }));
//               e.stopPropagation();
//             }}
//           />
//         </div>
//       </div>
//       <div className='preview-content'>{processContent(note.content)}</div>
//     </div>
//   );
// }

// export default PreviewNoteCard;
