import React from 'react';
import TopBar from './components/TopBar';
import Home from './pages/Home';

function App() {
  return (
    <div className='App'>
      <TopBar />
      <div className='content'>
        <Home />
      </div>
    </div>
  );
}

export default App;
