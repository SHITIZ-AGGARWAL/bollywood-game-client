import React from "react";

export default function Scoreboard({ scores }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      marginBottom: "1.5rem",
      fontSize: "1.5rem"
    }}>
      <div>🏆 Team A: <strong>{scores?.A || 0}</strong></div>
      <div>🏆 Team B: <strong>{scores?.B || 0}</strong></div>
    </div>
  );
}
