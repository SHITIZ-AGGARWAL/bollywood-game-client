import React from "react";

export default function TeamModal({
  currentRoom,
  teams,
  currentPlayerId,
  onStartGame,
  onJoinTeam,
  isLeader,
  myTeam
}) {
  const isReadyToStart =
    teams.A.players.length > 0 && teams.B.players.length > 0;

  return (
    <div style={modalStyle}>
      <h2>🎮 Choose Your Team</h2>
      <p style={{ marginBottom: "1rem" }}>
        Room Code: <strong>{currentRoom}</strong>
      </p>

      <div style={{ display: "flex", justifyContent: "space-around", gap: "2rem" }}>
        {/* Team A Section */}
        <div>
          <h3>Team A</h3>
          {teams.A.players.length === 0 && <div>No players</div>}
          {teams.A.players.map((p, i) => (
            <div key={i}>
              {p.id === currentPlayerId ? <b>👤 {p.name} (You)</b> : `👤 ${p.name}`}
            </div>
          ))}
          <button
            onClick={() => onJoinTeam("A")}
            disabled={myTeam === "A"}
            style={{
              marginTop: "0.5rem",
              backgroundColor: myTeam === "A" ? "#888" : "#28a745",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "5px"
            }}
          >
            {myTeam === "A" ? "Joined" : "Join Team A"}
          </button>
        </div>

        {/* Team B Section */}
        <div>
          <h3>Team B</h3>
          {teams.B.players.length === 0 && <div>No players</div>}
          {teams.B.players.map((p, i) => (
            <div key={i}>
              {p.id === currentPlayerId ? <b>👤 {p.name} (You)</b> : `👤 ${p.name}`}
            </div>
          ))}
          <button
            onClick={() => onJoinTeam("B")}
            disabled={myTeam === "B"}
            style={{
              marginTop: "0.5rem",
              backgroundColor: myTeam === "B" ? "#888" : "#007bff",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "5px"
            }}
          >
            {myTeam === "B" ? "Joined" : "Join Team B"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <p>Current Team: <strong>{myTeam || "Not in any team"}</strong></p>
        {isReadyToStart && isLeader ? (
          <button
            onClick={onStartGame}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.5rem",
              fontSize: "1rem",
              background: "limegreen",
              color: "#000",
              border: "none",
              borderRadius: "8px"
            }}
          >
            🚀 Start Game
          </button>
        ) : (
          <p style={{ color: "orange", marginTop: "1rem" }}>
            Both teams need at least one player to start the game.
          </p>
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
