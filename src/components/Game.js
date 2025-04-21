import React, { useEffect, useState } from "react";
import socket from "../utils/socketClient";
import BollywoodStrikeBoard from "./BollywoodStrikeBoard";
import Scoreboard from "./Scoreboard";
import ChatBox from "./ChatBox";
import TeamPanel from "./TeamPanel";
import "../styles/Game.css";

export default function Game({ room, name }) {
  const [myId, setMyId] = useState(null);
  const [teams, setTeams] = useState({ A: { players: [], leader: null }, B: { players: [], leader: null } });
  const [myTeam, setMyTeam] = useState(null);
  const [maskedMovie, setMaskedMovie] = useState("");
  const [strikes, setStrikes] = useState(0);
  const [currentTurn, setCurrentTurn] = useState("A");
  const [gameState, setGameState] = useState("submitting");
  const [letter, setLetter] = useState("");
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [round, setRound] = useState(1);
  const [revealedMovie, setRevealedMovie] = useState("");

  // ✅ FIX: Safely update my team
  const updateMyTeam = (teamsObj) => {
    if (!myId) {
      console.log("⚠️ myId not yet available for updateMyTeam");
      return;
    }
    console.log("🔍 Checking myTeam for ID:", myId, teamsObj);

    if (teamsObj.A.players.some(p => p.id === myId)) {
      setMyTeam("A");
    } else if (teamsObj.B.players.some(p => p.id === myId)) {
      setMyTeam("B");
    } else {
      setMyTeam(null);
    }
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    
    // Ensure myId is set immediately if socket is already connected
    if (socket.connected) {
      setMyId(socket.id);
      // Force a team state update if socket is already connected
      socket.emit("requestRoomState", { roomId: room });
    }

    socket.on("connect", () => {
      console.log("Socket connected, ID:", socket.id);
      setMyId(socket.id);
      // Request room state after reconnection
      socket.emit("requestRoomState", { roomId: room });
    });

    socket.on("roomState", ({ teams }) => {
      console.log("Room state update received:", teams);
      setTeams(teams);
      updateMyTeam(teams);
    });

    socket.on("updateTeams", (updatedTeams) => {
      console.log("Teams update received:", updatedTeams);
      setTeams(updatedTeams);
      updateMyTeam(updatedTeams);
    });

    socket.on("gameStarted", ({ turn, round, teams }) => {
      setGameState("submitting");
      setCurrentTurn(turn);
      setStrikes(0);
      setMaskedMovie("");
      setRound(round);
      setTeams(teams);

      // ✅ FIX: Delay updateMyTeam to ensure myId is set
      setTimeout(() => {
        updateMyTeam(teams);
      }, 100);
    });

    socket.on("movieReady", (masked) => {
      setGameState("guessing");
      setMaskedMovie(masked);
      setStrikes(0);
    });

    socket.on("correctGuess", (updatedMask) => setMaskedMovie(updatedMask));
    socket.on("wrongGuess", (strikeCount) => {
    setStrikes(strikeCount);
    if (strikeCount >= 9) {
      setGameState("watching");
    }
  });

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
      socket.off("updateTeams");
      socket.off("gameStarted");
      socket.off("movieReady");
      socket.off("correctGuess");
      socket.off("wrongGuess");
      socket.off("roundResult");
      socket.off("roundFailed");
      socket.off("roundStart");
    };
  }, [myId]);

  const isLeader = teams[myTeam]?.leader === myId;
  const isGuessingTeam = currentTurn !== myTeam;

  const [movieInput, setMovieInput] = useState("");

  const handleMovieSubmit = () => {
    const movie = movieInput.trim();
    if (movie) {
      socket.emit("submitMovie", { roomId: room, movie });
      setMovieInput("");
    }
  };

  const handleGuess = () => {
    if (!letter) return;
    socket.emit("guessLetter", { roomId: room, letter: letter.toUpperCase() });
    setLetter("");
  };

  const handleNextRound = () => {
    socket.emit("nextRound", { roomId: room });
  };

  const [connectionStatus, setConnectionStatus] = useState("connecting");

  useEffect(() => {
    socket.on("connect", () => {
      setConnectionStatus("connected");
      setMyId(socket.id);
    });

    socket.on("connect_error", () => {
      setConnectionStatus("error");
    });

    socket.on("reconnect", () => {
      setConnectionStatus("connected");
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("reconnect");
    };
  }, []);

  if (connectionStatus === "error") {
    return <p style={{ color: "#fff", padding: "2rem" }}>Connection error. Trying to reconnect...</p>;
  }

  if (!myId) {
    return <p style={{ color: "#fff", padding: "2rem" }}>Connecting to game server...</p>;
  }

  if (!myTeam) {
    // Request room state if team is not set
    socket.emit("requestRoomState", { roomId: room });
    return <p style={{ color: "#fff", padding: "2rem" }}>Syncing team data...</p>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🎮 Round {round} — Team {currentTurn}'s Turn</h2>
        <p className="team-status">You are in <strong>Team {myTeam}</strong> {isLeader && "(Leader)"}</p>
        <p className="room-code">Room Code: <strong>{room}</strong></p>
      </div>

      <div className="teams-container">
        <TeamPanel teams={teams} currentTeam={currentTurn} />
        <Scoreboard score={score} />
      </div>

      {gameState === "submitting" && (
        myTeam === currentTurn ? (
          isLeader ? (
            <div className="movie-input-container">
              <h3>🎬 Enter a Bollywood Movie</h3>
              <input
                type="text"
                value={movieInput}
                onChange={(e) => setMovieInput(e.target.value)}
                placeholder="Enter a Bollywood movie"
                className="movie-input"
              />
              <button className="game-button" onClick={handleMovieSubmit}>Submit</button>
            </div>
          ) : (
            <p>Waiting for your leader to submit a movie...</p>
          )
        ) : (
          <p>Team {currentTurn}'s leader is choosing a movie for you to guess... please wait.</p>
        )
      )}

      {gameState === "guessing" && (
        isGuessingTeam ? (
          <div>
            <BollywoodStrikeBoard strikesLeft={9 - strikes} />
            <div className="masked-movie">{maskedMovie}</div>
            <div>
              <input
                maxLength={1}
                value={letter}
                onChange={(e) => setLetter(e.target.value.toUpperCase())}
                className="letter-input"
                placeholder="A-Z"
              />
              <button className="game-button" onClick={handleGuess}>Guess</button>
            </div>
          </div>
        ) : (
          <div>
            <p>Team {currentTurn === "A" ? "B" : "A"} is guessing the movie...</p>
            <BollywoodStrikeBoard strikesLeft={9 - strikes} />
            <div style={{ fontSize: "2rem", letterSpacing: "1rem", margin: "1rem 0", fontFamily: "monospace" }}>{maskedMovie}</div>
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
