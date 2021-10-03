import React, { MouseEventHandler, ReactElement } from 'react';
import './Popup.css';

interface Props {
  open: boolean;
  children: ReactElement | ReactElement[];
  onBackgroundClick?: MouseEventHandler<HTMLDivElement>;
}

function Popup({ open, children, onBackgroundClick }: Props): ReactElement {
  if (!open) return <div />;
  return (
    <div className='modal-background' onClick={onBackgroundClick}>
      {children}
    </div>
  );
}

export default Popup;
