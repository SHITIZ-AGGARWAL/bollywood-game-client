import React, { useEffect, useState } from "react";
import socket from "../utils/socketClient";
import TeamPanel from "./TeamPanel";
import MovieInput from "./MovieInput";
import BollywoodStrikeBoard from "./BollywoodStrikeBoard";
import Timer from "./Timer";
import Keyboard from "./Keyboard";
import ChatBox from "./ChatBox";
import Scoreboard from "./Scoreboard";

export default function Game({ room, name }) {
  const [gameState, setGameState] = useState(null);
  const [guess, setGuess] = useState([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentTeam, setCurrentTeam] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [strikesLeft, setStrikesLeft] = useState(9); // BOLLYWOOD = 9 letters

  useEffect(() => {
    socket.emit("join-game", { room, name });

    socket.on("game-state", (state) => {
      setGameState(state);
      setCurrentTeam(state.currentTeam);
      setWrongCount(state.wrongGuesses);
      setStrikesLeft(9 - state.wrongGuesses);
      setGuess(state.guess);
      setIsLeader(state.leader === name);
    });

    return () => {
      socket.off("game-state");
    };
  }, [room, name]);

  const handleLetterClick = (letter) => {
    socket.emit("guess-letter", { room, letter });
  };

  return (
    <div style={{ padding: "1rem", color: "#fff", background: "#000", minHeight: "100vh" }}>
      {gameState && (
        <>
          <h2 style={{ marginBottom: "0.5rem" }}>🎥 Room Code: {room}</h2>
          <Scoreboard scores={gameState.scores} />
          <TeamPanel players={gameState.players} currentTeam={currentTeam} />
          <BollywoodStrikeBoard strikesLeft={strikesLeft} />
          <Timer duration={30} room={room} />
          {isLeader && currentTeam === gameState.team && !gameState.movie && (
            <MovieInput room={room} />
          )}
          {gameState.movie && (
            <div style={{ fontSize: "2rem", letterSpacing: "0.3rem", margin: "1rem 0" }}>
              {guess.map((char, idx) => (
                <span key={idx}>
                  {/[AEIOU]/i.test(char) ? char : char === "_" ? "_" : char}
                </span>
              ))}
            </div>
          )}
          {!isLeader && gameState.movie && (
            <Keyboard onLetterClick={handleLetterClick} usedLetters={gameState.usedLetters} />
          )}
          <ChatBox room={room} />
        </>
      )}
    </div>
  );
}
