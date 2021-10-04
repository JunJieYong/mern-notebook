import { BiNote, BiPlusMedical } from 'react-icons/bi';
import React, { ReactElement } from 'react';
import './TopBar.css';
import { useAppDispatch } from '../../app/hooks';
import { createNote } from '../../slices/noteSlice';

function TopBar(): ReactElement {
  const dispatch = useAppDispatch();
  return (
    <header className='topbar'>
      <div className='topbar-container'>
        <div className='topleft'>
          {/* <BiMenu className='menu'/> */}
          <div className='logo'>
            <BiNote />
            <span>Notes</span>
          </div>
        </div>
        <div className='topright'>
          <BiPlusMedical onClick={e => dispatch(createNote())}/>
          {/* <BiSearchAlt/>
          <BiCog/> */}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
