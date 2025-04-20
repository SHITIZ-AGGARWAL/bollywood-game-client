import React from "react";

export default function BollywoodStrikeBoard({ strikes }) {
  const fullWord = "BOLLYWOOD".split("");
  return (
    <div style={{ margin: "1rem 0", fontSize: "2rem", textAlign: "center" }}>
      {fullWord.map((letter, i) => (
        <span
          key={i}
          style={{
            margin: "0 0.3rem",
            textDecoration: i < strikes ? "line-through" : "none",
            color: i < strikes ? "#ff4d4d" : "#fff"
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
