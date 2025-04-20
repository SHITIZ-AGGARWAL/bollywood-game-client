import React from "react";

export default function TeamPanel({ players, currentTeam }) {
  const teamA = players.filter((p) => p.team === "A");
  const teamB = players.filter((p) => p.team === "B");

  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
      <div>
        <h3>Team A {currentTeam === "A" && "🔥"}</h3>
        {teamA.map((p) => (
          <div key={p.name}>{p.name} {p.isLeader && "👑"}</div>
        ))}
      </div>
      <div>
        <h3>Team B {currentTeam === "B" && "🔥"}</h3>
        {teamB.map((p) => (
          <div key={p.name}>{p.name} {p.isLeader && "👑"}</div>
        ))}
      </div>
    </div>
  );
}
