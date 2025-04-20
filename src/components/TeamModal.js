import React from "react";

export default function TeamModal({
  teams,
  currentPlayerId,
  currentRoom,
  onJoinTeam,
  onStartGame,
  isLeader,
}) {
  const teamA = teams?.A?.players || [];
  const teamB = teams?.B?.players || [];

  const canStart = teamA.length > 0 && teamB.length > 0;

  const playerTeam =
    teamA.find((p) => p.id === currentPlayerId) ? "A" :
    teamB.find((p) => p.id === currentPlayerId) ? "B" : null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.85)",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <h2>🎮 Select Your Team</h2>
      <p>Room Code: <strong>{currentRoom}</strong></p>

      <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
        <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <h3>Team A</h3>
          {teamA.map((p, i) => <div key={i}>{p.name} {p.id === currentPlayerId && "(You)"}</div>)}
          <button onClick={() => onJoinTeam("A")} disabled={playerTeam === "A"}>
            {playerTeam === "A" ? "In Team A" : "Join Team A"}
          </button>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <h3>Team B</h3>
          {teamB.map((p, i) => <div key={i}>{p.name} {p.id === currentPlayerId && "(You)"}</div>)}
          <button onClick={() => onJoinTeam("B")} disabled={playerTeam === "B"}>
            {playerTeam === "B" ? "In Team B" : "Join Team B"}
          </button>
        </div>
      </div>

      {isLeader && (
        <button
          onClick={onStartGame}
          disabled={!canStart}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 2rem",
            fontSize: "1.1rem",
            background: canStart ? "#28a745" : "#666",
            border: "none",
            color: "#fff",
            cursor: canStart ? "pointer" : "not-allowed"
          }}
        >
          Start Game
        </button>
      )}
    </div>
  );
}
