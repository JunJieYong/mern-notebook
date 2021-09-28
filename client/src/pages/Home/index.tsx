import React, { ReactElement } from 'react';
import './Home.css';
import PreviewNoteCard from '../../components/PreviewNoteCard';

function Home(): ReactElement {
  //TODO: Search
  return (
    <div className=''>
      <div className='notes-grid'>
        {new Array(37).fill(undefined).map((v,i) => (
          <PreviewNoteCard wide={i<1} idx={i}/>
        ))}
      </div>
    </div>
  );
}

export default Home;
