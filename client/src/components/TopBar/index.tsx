import { BiNote } from 'react-icons/bi';
import React, { ReactElement } from 'react';
import './TopBar.css';

function TopBar(): ReactElement {
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
          {/* <BiSearchAlt/>
          <BiCog/> */}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
