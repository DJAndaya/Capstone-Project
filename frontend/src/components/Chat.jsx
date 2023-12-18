import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socketio from "socket.io-client";

const socket = socketio(`${import.meta.env.VITE_BACKEND_URL}`);

export default function Chat() {
  const messageContainerRef = useRef(null);
  const user = useSelector(selectIsAuth);
  const userId = useSelector((state) => state.isAuth?.value?.id);
  const navigate = useNavigate();
  const [allMessages, setAllMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chattingWith, setChattingWith] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    socket.emit("get_messages", {
      fromUser: user.id,
    });

    socket.on("receive_message", (msgs) => {
      setAllMessages(msgs);
      // console.log(allMessages, "allmessages");
      // Move the logic that depends on the updated state here
      const updatedChatMessages = [];

      for (const msg of msgs) {
        const toUser = msg.toUser;

        if (!updatedChatMessages.some(([user]) => user[0] === toUser)) {
          updatedChatMessages.push([
            [toUser, msg.toFirstName, msg.toLastName],
            [],
          ]);
        }
      }
      // console.log(updatedChatMessages, "up");
      for (const user of updatedChatMessages) {
        for (const msg of msgs) {
          // console.log(user)
          // console.log(msg)
          if (msg.fromUser === user[0][0] || msg.toUser === user[0][0]) {
            user[1].push(msg);
          }
        }
      }

      setChatMessages(updatedChatMessages);
      // console.log(chatMessages, "a");
    });

    const fetchMessages = () => {
      socket.emit("get_messages", {
        fromUser: user.id,
      });
    };

    const intervalId = setInterval(() => {
      fetchMessages();
    }, 1000);
    // console.log("hi")

    return () => clearInterval(intervalId)
  
  }, [userId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [allMessages, chattingWith]);

  const inputRef = useRef(null)

  const sendMessage = () => {
    if (message.trim() && chattingWith) {
      socket.emit("send_message", {
        fromUser: user.id,
        toUser: chattingWith[0],
        toFirstName: chattingWith[1],
        toLastName: chattingWith[2],
        toSocketId: null,
        message: message,
      });
      setMessage("");
      inputRef.current.focus()
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      <div
        style={{
          flex: "0 0 13%",
          padding: "15px",
          outline: "2px solid #333",
          marginRight: "20px",
          overflowY: "auto",
        }}
      >
        <h2>Users:</h2>
        <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
          {chatMessages.map(
            (msg, index) =>
              msg[0][0] !== user.id && (
                <li
                  key={index}
                  style={{ listStyleType: "none" }}
                  onClick={() => setChattingWith(msg[0])}
                >
                  {msg[0][1]} {msg[0][2]}
                </li>
              )
          )}
        </ul>
      </div>
      <div
        style={{
          flex: "1",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {chattingWith ? (
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <h2>
              Chatting with {chattingWith[1]} {chattingWith[2]}
            </h2>
            <div
              ref={messageContainerRef}
              style={{ flex: "1", overflowY: "auto", padding: "15px" }}
            >
              {allMessages.map((msg, index) => {
                if (
                  msg.toUser === chattingWith[0] ||
                  msg.fromUser === chattingWith[0]
                ) {
                  return (
                    <div
                      key={index}
                      style={{
                        textAlign: msg.toUser === user.id ? "left" : "right",
                      }}
                    >
                      <strong>
                        {msg.fromUser === user.id
                          ? user.firstName
                          : chattingWith[1]}
                        {" - "}
                      </strong>
                      {msg.message}
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <div style={{ padding: "15px", borderTop: "2px solid #333" }}>
              <input
                ref={inputRef}
                value={message}
                onChange={(ev) => setMessage(ev.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={sendMessage}>Send message</button>
            </div>
          </div>
        ) : (
          <h2>Select someone to chat with</h2>
        )}
      </div>
    </div>
  );
}
