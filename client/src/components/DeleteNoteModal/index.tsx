import { ReactElement } from 'react';
import Modal, { ModalProps } from '../Modal';
import { useAppDispatch } from '../../app/hooks';
import { cancelNoteState, confirmedDeleteNote } from '../../reducers/noteSlice';

function DeleteNoteModal(): ReactElement {
  const dispatch = useAppDispatch();
  const props: ModalProps = {
    title: 'Delete Note',
    body: 'Are you sure you want to delete this note?',
    style: {
      width: '40%',
      minHeight: '10rem',
    },
    onPositiveButton: () => {
      dispatch(confirmedDeleteNote());
    },
    onNegativeButton: () => {
        dispatch(cancelNoteState())
    }
  };
  return <Modal {...props} />;
}

export default DeleteNoteModal;
