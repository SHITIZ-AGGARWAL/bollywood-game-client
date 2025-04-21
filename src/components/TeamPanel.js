import React from "react";
import "../styles/Game.css";

export default function TeamPanel({ teams = { A: { players: [] }, B: { players: [] } }, currentTeam }) {
  const teamA = teams?.A?.players || [];
  const teamB = teams?.B?.players || [];

  return (
    <div className="teams-container">
      <div className={`team-panel ${currentTeam === "A" ? "active" : ""}`}>
        <h3>Team A {currentTeam === "A" && "🔥"}</h3>
        {teamA.length === 0 ? (
          <p className="no-players">No players yet</p>
        ) : (
          teamA.map((p) => (
            <div key={p.id} className="player-item">
              <span className="player-name">{p.name}</span>
              {p.isLeader && <span className="leader-crown">👑</span>}
            </div>
          ))
        )}
      </div>
      <div className={`team-panel ${currentTeam === "B" ? "active" : ""}`}>
        <h3>Team B {currentTeam === "B" && "🔥"}</h3>
        {teamB.length === 0 ? (
          <p className="no-players">No players yet</p>
        ) : (
          teamB.map((p) => (
            <div key={p.id} className="player-item">
              <span className="player-name">{p.name}</span>
              {p.isLeader && <span className="leader-crown">👑</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );

}
