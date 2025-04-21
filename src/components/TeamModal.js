import React from "react";
import "../styles/TeamModal.css";

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
    <div className="team-modal">
      <div className="team-modal-header">
        <h2 className="team-modal-title">🎮 Choose Your Team</h2>
        <div className="room-code">
          Room Code: <strong>{currentRoom}</strong>
        </div>
      </div>

      <div className="teams-container">
        {/* Team A Section */}
        <div className="team-section">
          <h3 className="team-title">Team A</h3>
          <div className="player-list">
            {teams.A.players.length === 0 && <div>No players</div>}
            {teams.A.players.map((p, i) => (
              <div key={i} className={`player-item ${p.id === currentPlayerId ? 'current-player' : ''}`}>
                {p.id === currentPlayerId ? <b>👤 {p.name} (You)</b> : `👤 ${p.name}`}
              </div>
            ))}
          </div>
          <button
            onClick={() => onJoinTeam("A")}
            disabled={myTeam === "A"}
            className={`team-button team-a ${myTeam === "A" ? 'disabled' : ''}`}
          >
            {myTeam === "A" ? "Joined" : "Join Team A"}
          </button>
        </div>

        {/* Team B Section */}
        <div className="team-section">
          <h3 className="team-title">Team B</h3>
          <div className="player-list">
            {teams.B.players.length === 0 && <div>No players</div>}
            {teams.B.players.map((p, i) => (
              <div key={i} className={`player-item ${p.id === currentPlayerId ? 'current-player' : ''}`}>
                {p.id === currentPlayerId ? <b>👤 {p.name} (You)</b> : `👤 ${p.name}`}
              </div>
            ))}
          </div>
          <button
            onClick={() => onJoinTeam("B")}
            disabled={myTeam === "B"}
            className={`team-button team-b ${myTeam === "B" ? 'disabled' : ''}`}
          >
            {myTeam === "B" ? "Joined" : "Join Team B"}
          </button>
        </div>
      </div>

      <div className="start-game-section">
        <p className="current-team-text">Current Team: <strong>{myTeam || "Not in any team"}</strong></p>
        {isReadyToStart && isLeader ? (
          <button
            onClick={onStartGame}
            className="start-button"
          >
            🚀 Start Game
          </button>
        ) : (
          <p className="warning-text">
            Both teams need at least one player to start the game.
          </p>
        )}
      </div>
    </div>
  );
}
