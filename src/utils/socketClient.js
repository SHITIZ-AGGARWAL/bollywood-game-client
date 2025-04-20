import { io } from "socket.io-client";

const socket = io("https://bollywood-game-server-5995.onrender.com", {
  transports: ["websocket"]
});

export default socket;
