import React, { useState } from "react";
import socket from "../utils/socketClient";
import Game from "./Game";

export default function App() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState("");

  const createRoom = () => {
    if (!name.trim()) return alert("Enter your name");
    socket.emit("create-room", { name }, (code) => {
      setRoom(code);
      setJoined(true);
    });
  };

  const joinRoom = () => {
    if (!name.trim() || !room.trim()) return alert("Enter your name and room code");
    socket.emit("join-room", { room, name }, (success) => {
      if (success) setJoined(true);
      else alert("Failed to join room. Make sure the code is valid.");
    });
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
            style={{ margin: "0.5rem", padding: "0.5rem" }}
          />
          <br />
          <button onClick={createRoom} style={{ marginRight: "1rem" }}>Create Room</button>
          <input
            placeholder="Room Code"
            value={room}
            onChange={(e) => setRoom(e.target.value.toUpperCase())}
            style={{ margin: "0.5rem", padding: "0.5rem" }}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <Game room={room} name={name} />
      )}
    </div>
  );
}
