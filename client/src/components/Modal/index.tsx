import { AnimationProps, motion } from 'framer-motion';
import './Modal.css';
import { CSSProperties, MouseEventHandler, ReactElement, useState } from 'react';
import Popup from '../Popup';

export interface ModalProps {
  title: string;
  body: string | string[];
  style?: CSSProperties;
  positiveButton?: string;
  negativeButton?: string;
  onPositiveButton: () => void;
  onNegativeButton?: () => void;
}

function Modal({
  title,
  body,
  style,
  positiveButton,
  negativeButton,
  onPositiveButton,
  onNegativeButton,
}: ModalProps): ReactElement {
  const [modalOpen, setModalOpen] = useState(true);
  const modalProperties: AnimationProps = {
    animate: {
      y: 100,
      opacity: 1,
      maxWidth: '60%',
      maxHeight: '80vh',
    },
    transition: {
      damping: 300,
    },
  };

  const positiveClick: MouseEventHandler<HTMLButtonElement> = event => {
    setModalOpen(false);
    onPositiveButton();
  };

  const negativeClick: MouseEventHandler<any> = event => {
    setModalOpen(false);
    if (onNegativeButton) onNegativeButton();
  };

  return (
    <Popup open={modalOpen} onBackgroundClick={negativeClick}>
      <motion.div className='modal' style={style} {...modalProperties}>
        <div className='modal-title'>{title}</div>
        <div className='modal-body'>
          {body instanceof Array ? body.map(s => <div>{s}</div>) : body}
        </div>
        <div className='modal-buttons'>
          <button className='modal-pve' onClick={positiveClick}>
            {positiveButton ? positiveButton : 'Yes'}
          </button>
          <button className='modal-nve' onClick={negativeClick}>
            {negativeButton ? negativeButton : 'No'}
          </button>
        </div>
      </motion.div>
    </Popup>
  );
}

export default Modal;
