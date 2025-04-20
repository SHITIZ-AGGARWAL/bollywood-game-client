import React from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Keyboard({ onLetterClick, usedLetters }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "700px", margin: "auto", marginTop: "1rem" }}>
      {letters.map((letter) => (
        <button
          key={letter}
          onClick={() => onLetterClick(letter)}
          disabled={usedLetters?.includes(letter)}
          style={{
            width: "40px",
            height: "40px",
            margin: "5px",
            backgroundColor: usedLetters?.includes(letter) ? "#555" : "#222",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "4px",
            cursor: usedLetters?.includes(letter) ? "not-allowed" : "pointer"
          }}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
