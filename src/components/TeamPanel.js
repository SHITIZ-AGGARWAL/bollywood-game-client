import React from "react";

export default function TeamPanel({ teams = { A: { players: [] }, B: { players: [] } }, currentTeam }) {
  const teamA = teams?.A?.players || [];
  const teamB = teams?.B?.players || [];

  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
      <div>
        <h3>Team A {currentTeam === "A" && "🔥"}</h3>
        {teamA.length === 0 ? (
          <p style={{ color: "#999" }}>No players yet</p>
        ) : (
          teamA.map((p) => (
            <div key={p.id}>
              {p.name} {p.isLeader && "👑"}
            </div>
          ))
        )}
      </div>
      <div>
        <h3>Team B {currentTeam === "B" && "🔥"}</h3>
        {teamB.length === 0 ? (
          <p style={{ color: "#999" }}>No players yet</p>
        ) : (
          teamB.map((p) => (
            <div key={p.id}>
              {p.name} {p.isLeader && "👑"}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
