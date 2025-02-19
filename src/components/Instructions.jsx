import React from 'react';
import '../styles/instructions.css';

const Instructions = () => {
  return (
    <div className='instructions-wrapper'>
      <div className='instruction-title'>INSTRUCTIONS!</div>
      <div className='how-to-play-title'>
        <h2>How To Play?</h2>
        <h3>Single Player</h3>
        <p>1. Enter Your Name</p>
        <p>2. Press "Join Game"</p>
        <h3>Multiplayer</h3>
        <p>1. Enter Your Name</p>
        <p>2. Click Multiplayer</p>
        <p>3. Enter Room Number from 1 - 100</p>
        <p>4. Press "Join Game"</p>
      </div>
    </div>
  );
};

export default Instructions;
