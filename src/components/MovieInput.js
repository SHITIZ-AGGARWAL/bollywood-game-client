import React, { useState } from "react";
import socket from "../utils/socketClient";

export default function MovieInput({ roomId }) {
  const [movie, setMovie] = useState("");

  const sendMovie = () => {
    const trimmed = movie.trim().toUpperCase();
    if (!trimmed) return alert("Enter a movie");
    socket.emit("submitMovie", { roomId, movie: trimmed });
    setMovie("");
  };

  const suggestMovie = () => {
    const suggestions = ["SHOLAY", "DILWALE", "LAGAAN", "ANDHADHUN", "ZINDAGI", "QUEEN"];
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    setMovie(random);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3>🎞️ Enter Movie Title</h3>
      <input
        value={movie}
        onChange={(e) => setMovie(e.target.value.toUpperCase())}
        placeholder="Type a movie"
        style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
      />
      <button onClick={sendMovie}>Send</button>
      <button onClick={suggestMovie} style={{ marginLeft: "1rem" }}>🎲 Random</button>
    </div>
  );
}
import React, { useState } from "react";
import socket from "../utils/socketClient";

export default function MovieInput({ roomId }) {
  const [movie, setMovie] = useState("");

  const sendMovie = () => {
    const trimmed = movie.trim().toUpperCase();
    if (!trimmed) return alert("Enter a movie");
    socket.emit("submitMovie", { roomId, movie: trimmed });
    setMovie("");
  };

  const suggestMovie = () => {
    const suggestions = ["SHOLAY", "DILWALE", "LAGAAN", "ANDHADHUN", "ZINDAGI", "QUEEN"];
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    setMovie(random);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3>🎞️ Enter Movie Title</h3>
      <input
        value={movie}
        onChange={(e) => setMovie(e.target.value.toUpperCase())}
        placeholder="Type a movie"
        style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
      />
      <button onClick={sendMovie}>Send</button>
      <button onClick={suggestMovie} style={{ marginLeft: "1rem" }}>🎲 Random</button>
    </div>
  );
}
