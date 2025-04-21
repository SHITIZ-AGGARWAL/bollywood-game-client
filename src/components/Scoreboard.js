import React from "react";
import "../styles/Scoreboard.css";

export default function Scoreboard({ score }) {
  const teamAScore = score?.A || 0;
  const teamBScore = score?.B || 0;
  const isTeamAWinning = teamAScore > teamBScore;
  const isTeamBWinning = teamBScore > teamAScore;

  return (
    <div className="scoreboard">
      <h2 className="score-title">🏆 Score</h2>
      <div className="scores-container">
        <div className={`team-score ${isTeamAWinning ? 'winning' : ''}`}>
          <h3>Team A</h3>
          <div className="score-value">{teamAScore}</div>
        </div>
        <div className={`team-score ${isTeamBWinning ? 'winning' : ''}`}>
          <h3>Team B</h3>
          <div className="score-value">{teamBScore}</div>
        </div>
      </div>
    </div>
  );
}
