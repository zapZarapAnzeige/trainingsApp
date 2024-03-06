import React, { useState, useEffect, FC } from "react";
import { useAuthHeader } from "react-auth-kit";

export const SingleChat: FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const token = useAuthHeader();

  useEffect(() => {
    // Initialize WebSocket connection
    console.log(token());
    const ws = new WebSocket(
      `ws://localhost:8000/chat?token=` + token().split(" ")[1]
    );
    ws.onopen = () => {
      console.log("WebSocket Connected");
      //ws.send("Hello Server!"); // Example message sent to server upon connection
    };
    ws.onmessage = (event) => {
      console.log("Message from server ", event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    ws.onerror = (error) => {
      console.error("WebSocket Error ", error);
    };
    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    setWebsocket(ws);

    // Clean up the connection
    return () => {
      ws.close();
    };
  }, []); // Depend on clientId to reconnect if it changes

  // Example function to send a message to the server
  const sendMessage = (message: string) => {
    if (websocket) {
      websocket.send(
        JSON.stringify({ sender: "hey", recipient: "a", message: message })
      );
    }
  };

  return (
    <div>
      <h2>Chat Messages</h2>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
      <button onClick={() => sendMessage("Hi there!")}>Send Message</button>
    </div>
  );
};
