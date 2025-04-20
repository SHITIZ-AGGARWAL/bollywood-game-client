import React, { useEffect, useState } from "react";
import socket from "../utils/socketClient";
import BollywoodStrikeBoard from "./BollywoodStrikeBoard";
import Scoreboard from "./Scoreboard";
import ChatBox from "./ChatBox";

export default function Game({ room, name }) {
  const [myId, setMyId] = useState(null);
  const [teams, setTeams] = useState({ A: { players: [] }, B: { players: [] } });
  const [maskedMovie, setMaskedMovie] = useState("");
  const [strikes, setStrikes] = useState(0);
  const [currentTurn, setCurrentTurn] = useState("A");
  const [gameState, setGameState] = useState("waiting"); // waiting, submitting, guessing, watching
  const [letter, setLetter] = useState("");
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [round, setRound] = useState(1);

  useEffect(() => {
    socket.on("connect", () => {
      setMyId(socket.id);
    });

    socket.on("updateTeams", (updated) => {
      setTeams(updated);
    });

    socket.on("gameStarted", () => {
      setGameState("submitting");
      setCurrentTurn("A");
      setStrikes(0);
      setMaskedMovie("");
    });

    socket.on("movieReady", (masked) => {
      setGameState("guessing");
      setMaskedMovie(masked);
      setStrikes(0);
    });

    socket.on("correctGuess", (updatedMask) => {
      setMaskedMovie(updatedMask);
    });

    socket.on("wrongGuess", (strikeCount) => {
      setStrikes(strikeCount);
    });

    socket.on("roundResult", ({ score }) => {
      setScore({
        A: score.A.score,
        B: score.B.score
      });
      setGameState("watching");
    });

    socket.on("roundFailed", ({ movie }) => {
      alert(`Movie was: ${movie}`);
      setGameState("watching");
    });

    socket.on("roundStart", (turn) => {
      setCurrentTurn(turn);
      setMaskedMovie("");
      setStrikes(0);
      setLetter("");
      setGameState("submitting");
    });

    return () => {
      socket.off("gameStarted");
      socket.off("updateTeams");
      socket.off("movieReady");
      socket.off("correctGuess");
      socket.off("wrongGuess");
      socket.off("roundResult");
      socket.off("roundFailed");
      socket.off("roundStart");
    };
  }, []);

  const getTeam = () => {
    return teams.A.players.find(p => p.id === myId) ? "A" : "B";
  };

  const isLeader = () => {
    const team = getTeam();
    return teams[team].leader === myId;
  };

  const handleMovieSubmit = () => {
    const movie = prompt("Enter a movie name").trim();
    if (movie) {
      socket.emit("submitMovie", { roomId: room, movie });
    }
  };

  const handleGuess = () => {
    if (!letter) return;
    socket.emit("guessLetter", { roomId: room, letter: letter.toUpperCase() });
    setLetter("");
  };

  const handleNextRound = () => {
    socket.emit("nextRound", { roomId: room });
    setGameState("submitting");
  };

  const myTeam = getTeam();
  const isGuessingTeam = currentTurn !== myTeam;

  return (
    <div style={{ padding: "1rem", background: "#000", color: "#fff", minHeight: "100vh" }}>
      <h2>🎬 Round {round} — Turn: Team {currentTurn}</h2>
      <p>You are in <strong>Team {myTeam}</strong> {isLeader() && "(Leader)"}</p>
      <p>Room Code: <strong>{room}</strong></p>

      <Scoreboard teams={teams} />

      {gameState === "submitting" ? (
        myTeam === currentTurn ? (
          isLeader() ? (
            <div>
              <h3>🎬 Enter a movie for Team {currentTurn === "A" ? "B" : "A"} to guess:</h3>
              <button onClick={handleMovieSubmit}>Submit Movie</button>
            </div>
          ) : (
            <p>Waiting for your leader to submit a movie...</p>
          )
        ) : (
          <p>Team {currentTurn} is giving a movie... please wait.</p>
        )
      ) : gameState === "guessing" ? (
        isGuessingTeam ? (
          <div>
            <BollywoodStrikeBoard strikes={strikes} />
            <div style={{ fontSize: "2rem", letterSpacing: "1rem", margin: "1rem 0" }}>
              {maskedMovie}
            </div>
            <input
              maxLength={1}
              value={letter}
              onChange={(e) => setLetter(e.target.value.toUpperCase())}
              style={{ fontSize: "1.5rem", padding: "0.5rem", width: "80px" }}
            />
            <button onClick={handleGuess} style={{ marginLeft: "1rem" }}>Guess</button>
          </div>
        ) : (
          <div>
            <p>The other team is guessing your movie...</p>
            <BollywoodStrikeBoard strikes={strikes} />
            <div style={{ fontSize: "2rem", letterSpacing: "1rem", margin: "1rem 0" }}>
              {maskedMovie}
            </div>
          </div>
        )
      ) : gameState === "watching" ? (
        isLeader() && (
          <div>
            <p>Round over. Click to start next round.</p>
            <button onClick={handleNextRound}>Next Round</button>
          </div>
        )
      ) : null}

      <hr style={{ margin: "2rem 0", borderColor: "#444" }} />
      <ChatBox room={room} />
    </div>
  );
}
