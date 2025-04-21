import React from 'react';
import '../styles/Landing.css';

const Landing = ({ onCreateGame, onJoinGame }) => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Bollywood Game</h1>
        <p className="landing-subtitle">
          Test your Bollywood knowledge in this exciting multiplayer game!
          Create a new game room or join an existing one to start playing.
        </p>
        <div className="landing-buttons">
          <button
            className="landing-button primary"
            onClick={onCreateGame}
          >
            Create Game
          </button>
          <button
            className="landing-button secondary"
            onClick={onJoinGame}
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;