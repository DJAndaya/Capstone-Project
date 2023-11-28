import { useState, useEffect } from "react";
import axios from "axios";
// material UI imports
import {
  Box,
  Grid,
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@mui/material/";
// component imports
import ItemCards from "./ItemCards";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";

import AddToCartButton from "./AddToCartButton";
import ReviewButton from "./ReviewButton";

import socketio from "socket.io-client";

const socket = socketio("http://localhost:3000");

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectIsAuth);
  const [items, setItems] = useState(null);
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/items");

        // console.log(response.data);
        const alphabeticalOrderData = response.data.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        // console.log(alphabeticalOrderData);
        setItems(alphabeticalOrderData);
      } catch (error) {
        console.log(error);
      }
    };
    getItems();

    if (user) {
      socket.emit("user_joined", user);
    }

    socket.on("update_socket", (updatedUserData) => {
      dispatch(setIsAuth(updatedUserData));
    });

    socket.on("receive_message", (msgs) => {
      setAllMessages(msgs);
      console.log(allMessages);
    });
  }, []);

  const [selectedUserToChatWith, setSelectedUserToChatWith] = useState(null);
  const [message, setMessage] = useState("");

  const startChat = async (toUser) => {
    console.log(toUser);
    console.log(toUser.id);
    console.log(allMessages)
    if (toUser.socketId === user.socketId) {
      return;
    }
    setSelectedUserToChatWith(toUser);
    socket.emit("get_messages", {
      fromUser: user.id,
    });
  };

  const sendMessage = () => {
    console.log(selectedUserToChatWith);
    socket.emit("send_message", {
      fromUser: user.id,
      toUser: selectedUserToChatWith.id,
      toSocketId: selectedUserToChatWith.socketId,
      message,
    });
  };

  if (!items) {
    return <h1>loading</h1>;
  } else {
    return (
      <Grid container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 1, md: 1 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {items.map((item, idx) => {
              return (
                <Grid item xs={2} sm={2} md={2} key={idx}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {item.name}
                      </Typography>
                      <Typography variant="h7" component="div">
                        Seller Name
                      </Typography>
                      <Typography component="div">
                        {item.description}
                      </Typography>
                      <CardActions>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => startChat(item.seller[0])}
                        >
                          Chat
                        </Button>
                        <ReviewButton item={item} />
                        <AddToCartButton item={item} />
                      </CardActions>
                      <Typography variant="h6" component="div">
                        ${item.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {selectedUserToChatWith && (
          <div
            style={{
              border: "1px solid lightseagreen",
              position: "fixed",
              bottom: 16,
              right: 16,
              overflowY: "auto", // Enable vertical scrolling
              maxHeight: "50vh", // Set maximum height to 80% of the viewport height
              width: 300,
              backgroundColor: "rgba(0, 0, 0, 0.95)",
              zIndex: 1000,
            }}
          >
            <h3>You are chatting with {selectedUserToChatWith.socketId}</h3>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {allMessages.map((msg, index) => {
                if (msg.toUser === selectedUserToChatWith.id || msg.fromUser === selectedUserToChatWith.id) {
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
            </div>

            <div style={{ position: "absolute", bottom: 0, marginTop: "auto"}}>
              <input
                value={message}
                onChange={(ev) => setMessage(ev.target.value)}
              />
              <button onClick={sendMessage}>Send message</button>
            </div>
          </div>
        )}
      </Grid>
    );
  }
};

export default Home;
