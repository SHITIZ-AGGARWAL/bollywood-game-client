import React, { useEffect, useState } from "react";
import socket from "../utils/socketClient";
import Game from "./Game";
import TeamModal from "./TeamModal";

export default function App() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState("");
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [teams, setTeams] = useState({ A: { players: [], leader: null }, B: { players: [], leader: null } });
  const [gameStarted, setGameStarted] = useState(false);
  const [myId, setMyId] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const [myTeam, setMyTeam] = useState(null);

  useEffect(() => {
    setMyId(socket.id);

    socket.on("roomCreated", (code) => {
      setRoom(code);
      setJoined(true);
    });

    socket.on("playerJoined", ({ playerId }) => {
      console.log("Player joined:", playerId);
    });

    socket.on("roomState", ({ teams }) => {
      setTeams(teams);

      const myTeamPlayer =
        teams.A.players.find((p) => p.id === socket.id) ||
        teams.B.players.find((p) => p.id === socket.id);

      if (myTeamPlayer?.isLeader) {
        setIsLeader(true);
      }

      if (teams.A.players.find((p) => p.id === socket.id)) {
        setMyTeam("A");
      } else if (teams.B.players.find((p) => p.id === socket.id)) {
        setMyTeam("B");
      }
    });

    socket.on("gameStarted", ({ turn, round, teams }) => {
      setGameStarted(true);
      setTeams(teams);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("playerJoined");
      socket.off("roomState");
      socket.off("gameStarted");
    };
  }, []);

  const createRoom = () => {
    if (!name.trim()) return alert("Enter your name");
    const roomCode = Math.random().toString(36).substr(2, 5).toUpperCase();
    socket.emit("createRoom", { roomId: roomCode, player: { name } });
  };

  const joinRoom = () => {
    if (!name.trim() || !room.trim()) return alert("Enter your name and room code");
    socket.emit("joinRoom", { roomId: room, player: { name } });
    setJoined(true);
  };

  const joinTeam = (team) => {
    socket.emit("joinTeam", { roomId: room, team });
  };

  const startGame = () => {
    socket.emit("startGame", { roomId: room });
  };

  return (
    <div style={{ padding: "2rem", background: "#111", color: "#fff", minHeight: "100vh" }}>
      {!joined ? (
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎬 Bollywood Game</h1>
          <input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ margin: "0.5rem", padding: "0.5rem", width: "300px" }}
          />
          <br /><br />
          <button onClick={createRoom} style={{ marginRight: "1rem" }}>Create Room</button>
          <button onClick={() => setShowJoinPopup(true)}>Join Room</button>

          {showJoinPopup && (
            <div style={{
              background: "#222",
              padding: "1rem",
              marginTop: "1rem",
              borderRadius: "8px",
              maxWidth: "350px"
            }}>
              <h3>Enter Room Code</h3>
              <input
                placeholder="Room Code"
                value={room}
                onChange={(e) => setRoom(e.target.value.toUpperCase())}
                style={{ margin: "0.5rem 0", padding: "0.5rem", width: "100%" }}
              />
              <button onClick={joinRoom} style={{ marginRight: "1rem" }}>Join</button>
              <button onClick={() => setShowJoinPopup(false)}>Cancel</button>
            </div>
          )}
        </div>
      ) : !gameStarted ? (
        <TeamModal
          teams={teams}
          currentPlayerId={myId}
          currentRoom={room}
          onJoinTeam={joinTeam}
          onStartGame={startGame}
          isLeader={isLeader}
          myTeam={myTeam}
        />
      ) : (
        <Game
          room={room}
          name={name}
          myId={myId}
          myTeam={myTeam}
        />
      )}
    </div>
  );
}
