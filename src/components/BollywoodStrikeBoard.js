import React from "react";

export default function BollywoodStrikeBoard({ strikesLeft }) {
  const fullWord = "BOLLYWOOD".split("");
  const struck = 9 - strikesLeft;

  return (
    <div style={{ margin: "1rem 0", fontSize: "2rem", textAlign: "center" }}>
      {fullWord.map((letter, i) => (
        <span
          key={i}
          style={{
            margin: "0 0.3rem",
            textDecoration: i < struck ? "line-through" : "none",
            color: i < struck ? "#ff4d4d" : "#fff"
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
