import React, { useState, useEffect, useRef } from "react";
import socket from "../utils/socketClient";

export default function ChatBox({ room, name, myTeam }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Request chat history when component mounts
    if (socket.connected) {
      socket.emit("request-chat-history", { roomId: room });
    }

    const handleChatHistory = (history) => {
      if (Array.isArray(history)) {
        setMessages(history.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp).toLocaleTimeString()
        })));
      }
    };

    const handleReceiveMessage = (message) => {
      if (message && message.sender && message.message) {
        setMessages((prev) => [...prev, {
          ...message,
          timestamp: new Date(message.timestamp || Date.now()).toLocaleTimeString()
        }]);
      }
    };

    socket.on("chat-history", handleChatHistory);
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("chat-history", handleChatHistory);
    };
  }, [room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && socket.connected) {
      const messageData = {
        roomId: room,
        message: input.trim(),
        sender: name,
        team: myTeam,
        timestamp: new Date().toLocaleTimeString()
      };
      
      socket.emit("send-message", messageData);
      setInput("");
      
      // Optimistically add message to UI
      setMessages(prev => [...prev, messageData]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h4>💬 Team Chat</h4>
        <span className="chat-room-info">Room: {room}</span>
      </div>
      <div className="message-list">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === name ? 'message-own' : 'message-other'} ${msg.team === myTeam ? 'message-team' : ''}`}>
            <div className="message-header">
              <span className="message-sender">{msg.sender}</span>
              <span className="message-team-tag">{msg.team ? `Team ${msg.team}` : ''}</span>
              <span className="message-time">{msg.timestamp}</span>
            </div>
            <div className="message-content">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="chat-send-button" onClick={sendMessage}>
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
