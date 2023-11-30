import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socketio from "socket.io-client";

const socket = socketio("http://localhost:3000");

export default function Chat() {
  const user = useSelector(selectIsAuth);
  const navigate = useNavigate()
  const [allMessages, setAllMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chattingWith, setChattingWith] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    socket.on("receive_message", (msgs) => {
      setAllMessages(msgs);

      // Move the logic that depends on the updated state here
      const updatedChatMessages = [];

      for (const msg of msgs) {
        const toUser = msg.toUser;

        if (!updatedChatMessages.some(([user]) => user === toUser)) {
          updatedChatMessages.push([toUser, []]);
        }
      }

      for (const user of updatedChatMessages) {
        for (const msg of msgs) {
          if (msg.fromUser === user[0] || msg.toUser === user[0]) {
            user[1].push(msg);
          }
        }
      }

      setChatMessages(updatedChatMessages);
    });

    socket.emit("get_messages", {
      fromUser: user.id,
    });
  }, [user]);

  const sendMessage = () => {
    socket.emit("send_message", {
      fromUser: user.id,
      toUser: chattingWith,
      toSocketId: null,
      message: message
    });
  };

  // useEffect(() => {
  //   socket.on("receive_message", (msgs) => {
  //     setAllMessages(msgs);

  //     const updatedChatMessages = [];

  //     const fetchData = async () => {
  //       for (const msg of allMessages) {
  //         const toUser = msg.toUser;

  //         if (!updatedChatMessages.some(([user]) => user === toUser)) {
  //           try {
  //             const response = await axios.get(
  //               `http://localhost:3000/auth/getSocketId/${toUser}`
  //             );
  //             const userData = response.data;
  //             console.log(userData);

  //             updatedChatMessages.push([toUser, []]);
  //           } catch (error) {
  //             console.error(
  //               `Error fetching user data for user ID ${toUser}:`,
  //               error
  //             );
  //           }
  //         }
  //       }

  //       for (const user of updatedChatMessages) {
  //         for (const msg of allMessages) {
  //           if (msg.fromUser === user[0] || msg.toUser === user[0]) {
  //             user[1].push(msg);
  //           }
  //         }
  //       }

  //       setChatMessages(updatedChatMessages);
  //     };

  //     fetchData();
  //     console.log(allMessages);
  //     console.log(chatMessages, "chat");
  //   });

  //   socket.emit("get_messages", {
  //     fromUser: user.id,
  //   });
  // }, []);

//   const sendMessage = () => {
//     console.log(selectedUserToChatWith);
//     socket.emit("send_message", {
//       fromUser: user.id,
//       toUser: selectedUserToChatWith.id,
//       toSocketId: selectedUserToChatWith.socketId,
//       message,
//     });
//   };

  return (
    <div>
      <div>
        <h2>Users:</h2>
        <ul>
          {chatMessages.map((msg, index) => (
            <li
              key={index}
              style={{ listStyleType: "none" }}
              onClick={() => setChattingWith(msg[0])}
            >
              {msg[0]}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {chattingWith ? (
          <div>
            <h2>Chatting with {chattingWith}</h2>
            {allMessages.map((msg, index) => {
              if (
                msg.toUser === chattingWith ||
                msg.fromUser === chattingWith
              ) {
                return (
                  <div
                    key={index}
                    style={{
                      textAlign: msg.toUser === user.id ? "left" : "right",
                    }}
                  >
                    <strong>
                      {msg.fromUser === user.id ? user.id : msg.fromUser}
                      {" - "}
                    </strong>
                    {msg.message}
                  </div>
                );
              }
              return null; // Return null if the condition is not met
            })}
            <div style={{ position: "absolute", bottom: 0, marginTop: "auto" }}>
              <input
                value={message}
                onChange={(ev) => setMessage(ev.target.value)}
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
