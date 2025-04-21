import React from "react";

export default function BollywoodStrikeBoard({ strikesLeft }) {
  const fullWord = "BOLLYWOOD".split("");
  const totalStrikes = 9 - strikesLeft;
  
  return (
    <div className="strike-board">
      <div className="strike-word">
        {fullWord.map((letter, i) => (
          <span
            key={i}
            className={`strike-letter ${i < totalStrikes ? 'struck' : ''} ${strikesLeft <= 3 ? 'danger' : ''}`}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className={`chances-text ${strikesLeft <= 3 ? 'danger-pulse' : ''}`}>
        {strikesLeft} chances left
      </div>
    </div>
  );

}
