import { io } from "socket.io-client";

// Replace with your Render backend URL
const socket = io("https://bollywood-backend.onrender.com", {
  transports: ["websocket"],
});

export default socket;
