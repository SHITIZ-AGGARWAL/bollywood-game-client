import React from "react";

export default function TeamModal({ currentRoom, teams, currentPlayerId, onStartGame, onJoinTeam }) {
  const myTeam = teams.A.players.find(p => p.id === currentPlayerId)
    ? "A"
    : teams.B.players.find(p => p.id === currentPlayerId)
    ? "B"
    : null;

  const isReadyToStart =
    teams.A.players.length > 0 && teams.B.players.length > 0;

  return (
    <div style={modalStyle}>
      <h2>Choose Your Team</h2>
      <div style={{ display: "flex", justifyContent: "space-around", gap: "2rem" }}>
        <div>
          <h3>Team A</h3>
          {teams.A.players.map((p, i) => (
            <div key={i}>
              {p.id === currentPlayerId ? <b>{p.name || "You"}</b> : p.name || `Player ${i + 1}`}
            </div>
          ))}
          <button onClick={() => onJoinTeam("A")}>Join Team A</button>
        </div>
        <div>
          <h3>Team B</h3>
          {teams.B.players.map((p, i) => (
            <div key={i}>
              {p.id === currentPlayerId ? <b>{p.name || "You"}</b> : p.name || `Player ${i + 1}`}
            </div>
          ))}
          <button onClick={() => onJoinTeam("B")}>Join Team B</button>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <p>Room Code: <strong>{currentRoom}</strong></p>
        <p>Current Team: <strong>{myTeam || "None"}</strong></p>
        {isReadyToStart ? (
          <button onClick={onStartGame} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
            🚀 Start Game
          </button>
        ) : (
          <p style={{ color: "orange" }}>Both teams need at least 1 player to start</p>
        )}
      </div>
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  top: "10%",
  left: "10%",
  right: "10%",
  padding: "2rem",
  background: "#222",
  borderRadius: "10px",
  border: "2px solid #555",
  color: "#fff",
  zIndex: 1000,
};
