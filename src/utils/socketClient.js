import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Socket reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.error("Socket reconnection error:", error);
});

export default socket;
