import React, { useState, useEffect } from "react";
import socket from "../utils/socketClient";

export default function ChatBox({ room, name }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("receive-message", ({ sender, message }) => {
      setMessages((prev) => [...prev, { sender, message }]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("send-message", { roomId: room, message: input, sender: name });
      setInput("");
    }
  };

  return (
    <div style={{ marginTop: "1rem", borderTop: "1px solid #333", paddingTop: "1rem" }}>
      <h4>💬 Team Chat</h4>
      <div style={{ maxHeight: "150px", overflowY: "auto", background: "#222", padding: "0.5rem" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: "0.25rem 0" }}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "80%", marginTop: "0.5rem", padding: "0.4rem" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "0.5rem" }}>Send</button>
    </div>
  );
}
