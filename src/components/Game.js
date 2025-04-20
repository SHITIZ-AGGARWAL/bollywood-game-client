import React, { useEffect, useState } from "react";
import socket from "../utils/socketClient";
import BollywoodStrikeBoard from "./BollywoodStrikeBoard";
import Scoreboard from "./Scoreboard";
import ChatBox from "./ChatBox";
import TeamPanel from "./TeamPanel";

export default function Game({ room, name }) {
  const [myId, setMyId] = useState(null);
  const [teams, setTeams] = useState({ A: { players: [], leader: null }, B: { players: [], leader: null } });
  const [myTeam, setMyTeam] = useState(null); // ✅ FIX 1: Manual myTeam tracking
  const [maskedMovie, setMaskedMovie] = useState("");
  const [strikes, setStrikes] = useState(0);
  const [currentTurn, setCurrentTurn] = useState("A");
  const [gameState, setGameState] = useState("waiting");
  const [letter, setLetter] = useState("");
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [round, setRound] = useState(1);
  const [revealedMovie, setRevealedMovie] = useState("");

  useEffect(() => {
    socket.on("connect", () => setMyId(socket.id)); // ✅ FIX 2: Set myId on connect

    socket.on("roomState", ({ teams }) => {
      setTeams(teams);
      updateMyTeam(teams); // ✅ FIX 1.1
    });

    socket.on("updateTeams", (updatedTeams) => {
      setTeams(updatedTeams);          // ✅ FIX 2A: show updated names
      updateMyTeam(updatedTeams);      // ✅ FIX 2A: update my team if changed
    });

    socket.on("gameStarted", ({ turn, round, teams }) => {
      setGameState("submitting");
      setCurrentTurn(turn);
      setStrikes(0);
      setMaskedMovie("");
      setRound(round);
      setTeams(teams);
      updateMyTeam(teams); // ✅ FIX 1.2
    });

    socket.on("movieReady", (masked) => {
      setGameState("guessing");
      setMaskedMovie(masked);
      setStrikes(0);
    });

    socket.on("correctGuess", (updatedMask) => setMaskedMovie(updatedMask));
    socket.on("wrongGuess", (strikeCount) => setStrikes(strikeCount));

    socket.on("roundResult", ({ score }) => {
      setScore({
        A: score.A.score,
        B: score.B.score,
      });
      setGameState("watching");
    });

    socket.on("roundFailed", ({ movie }) => {
      setRevealedMovie(movie);
      setGameState("watching");
    });

    socket.on("roundStart", (turn) => {
      setRound((prev) => prev + 1);
      setCurrentTurn(turn);
      setMaskedMovie("");
      setStrikes(0);
      setLetter("");
      setRevealedMovie("");
      setGameState("submitting");
    });

    return () => {
      socket.off("connect");
      socket.off("roomState");
      socket.off("updateTeams"); // ✅ CLEANUP
      socket.off("gameStarted");
      socket.off("movieReady");
      socket.off("correctGuess");
      socket.off("wrongGuess");
      socket.off("roundResult");
      socket.off("roundFailed");
      socket.off("roundStart");
    };
  }, []);

  // ✅ FIX 1.3: Track myTeam manually instead of getTeam()
  const updateMyTeam = (teamsObj) => {
    if (!myId) return;
    if (teamsObj.A.players.some(p => p.id === myId)) setMyTeam("A");
    else if (teamsObj.B.players.some(p => p.id === myId)) setMyTeam("B");
    else setMyTeam(null);
  };

  const isLeader = teams[myTeam]?.leader === myId;
  const isGuessingTeam = currentTurn !== myTeam;

  const handleMovieSubmit = () => {
    const movie = prompt("🎬 Enter a Bollywood movie").trim();
    if (movie) socket.emit("submitMovie", { roomId: room, movie });
  };

  const handleGuess = () => {
    if (!letter) return;
    socket.emit("guessLetter", { roomId: room, letter: letter.toUpperCase() });
    setLetter("");
  };

  const handleNextRound = () => {
    socket.emit("nextRound", { roomId: room });
  };

  // ✅ FIX 3: Show loading until myId + myTeam is available
  if (!myId || !myTeam) {
    return <p style={{ color: "#fff", padding: "2rem" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "2rem", background: "#111", color: "#fff", minHeight: "100vh" }}>
      <h2>🎮 Round {round} — Team {currentTurn}'s Turn</h2>
      <p>You are in <strong>Team {myTeam}</strong> {isLeader && "(Leader)"}</p>
      <p>Room Code: <strong>{room}</strong></p>

      <TeamPanel teams={teams} currentTeam={currentTurn} />
      <Scoreboard teams={teams} />

      {gameState === "submitting" && (
        myTeam === currentTurn ? (
          isLeader ? (
            <div>
              <h3>🎬 You're the leader. Submit a movie for the other team:</h3>
              <button onClick={handleMovieSubmit}>Submit Movie</button>
            </div>
          ) : (
            <p>Waiting for your leader to submit a movie...</p>
          )
        ) : (
          <p>Team {currentTurn} is submitting a movie... please wait.</p>
        )
      )}

      {gameState === "guessing" && (
        isGuessingTeam ? (
          <div>
            <BollywoodStrikeBoard strikesLeft={9 - strikes} />
            <div style={{ fontSize: "2rem", letterSpacing: "1rem", margin: "1rem 0" }}>{maskedMovie}</div>
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
            <BollywoodStrikeBoard strikesLeft={9 - strikes} />
            <div style={{ fontSize: "2rem", letterSpacing: "1rem", margin: "1rem 0" }}>{maskedMovie}</div>
          </div>
        )
      )}

      {gameState === "watching" && (
        <div>
          {revealedMovie ? (
            <p>😞 Round failed! The movie was <strong>{revealedMovie}</strong></p>
          ) : (
            <p>✅ Team {currentTurn === "A" ? "B" : "A"} guessed correctly!</p>
          )}
          {isLeader && (
            <button onClick={handleNextRound}>Start Next Round</button>
          )}
        </div>
      )}

      <hr style={{ margin: "2rem 0", borderColor: "#444" }} />
      <ChatBox room={room} name={name} />
    </div>
  );
}
