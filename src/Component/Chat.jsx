import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, room, username }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [connectedUser, setConnectedUser] = useState("");

  const sendMsg = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    const handleUserConnected = (data) => {
      setConnectedUser(data);
      // Display a user join message
      const joinMessage = {
        author: "System",
        message: `${data === username ? "you" : data} joined the room`,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        type: "join", // Added a type to identify system messages
      };
      setMessageList((list) => [...list, joinMessage]);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("user-Connected", handleUserConnected);

    return () => {
      // Cleanup function to remove the event listeners when component unmounts
      socket.off("receive_message", handleReceiveMessage);
      socket.off("user-Connected", handleUserConnected);
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>ChatPulse</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className={`message ${
                messageContent.type === "join" ? "system-message" : ""
              }`}
              id={username === messageContent.author ? "you" : "other"}
            >
              <div>
                <div
                  className={`${
                    messageContent.type === "join"
                      ? "newUser"
                      : "message-content "
                  }`}
                >
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">
                    {messageContent.type !== "join" && messageContent.time}
                  </p>
                  <p id="author">
                    {messageContent.type !== "join" && messageContent.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="write a message ..."
          value={currentMessage}
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(e) => e.key === "Enter" && sendMsg()}
        />
        <button onClick={sendMsg}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
