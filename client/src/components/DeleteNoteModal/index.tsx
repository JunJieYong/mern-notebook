import { ReactElement } from 'react';
import Modal, { ModalProps } from '../Modal';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { cancelNoteState, notesSelector, removeNote } from '../../slices/noteSlice';

function DeleteNoteModal(): ReactElement {
  const dispatch = useAppDispatch();
  const {deletingId} = useAppSelector(notesSelector)
  const props: ModalProps = {
    title: 'Delete Note',
    body: 'Are you sure you want to delete this note?',
    style: {
      width: '40%',
      minHeight: '10rem',
    },
    onPositiveButton: () => {
      if(deletingId)
      dispatch(removeNote({_id: deletingId}));
    },
    onNegativeButton: () => {
        dispatch(cancelNoteState())
    }
  };
  return <Modal {...props} />;
}

export default DeleteNoteModal;
