import React, { useEffect, useState } from "react";
import socket from "../utils/socketClient";

export default function Timer({ duration = 30, room }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          socket.emit("timeout-strike", { room });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [room]);

  return (
    <div style={{ fontSize: "1.5rem", margin: "1rem 0", textAlign: "center" }}>
      ⏱️ Time Left: {timeLeft}s
    </div>
  );
}
