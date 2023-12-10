import { useState, useEffect, useRef } from "react";
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
  Modal,
} from "@mui/material/";
// component imports
import ItemCards from "./ItemCards";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";

import AddToCartButton from "./AddToCartButton";
import ShoppingCartButton from "./ShoppingCartButton";
import ReviewButton from "./ReviewButton";
import ProductDetail from "./ProductDetail";

import socketio from "socket.io-client";

const socket = socketio("http://localhost:3000");
// redux
// router
import { useLocation, useOutletContext } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectIsAuth);
  const [items, setItems] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null); // New state variable
  const location = useLocation();
  const { pathname } = location;
  const [outletContext] = useOutletContext();

  const wishlist = outletContext.wishlist;
  const userId = useSelector((state) => state.isAuth?.value?.id);
  // console.log(outletContext.shoppingCart)

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const getItems = async () => {
      // console.log("Current pathname:", pathname);
      try {
        let response;
        if (pathname === "/user/orders") {
          response = await axios.get(
            "http://localhost:3000/items/orderhistory",
            {
              params: { userId: userId },
            }
          );
          const alphabeticalOrderData = response.data.sort((a, b) =>
            a.name > b.name ? 1 : -1
          );
          setItems(alphabeticalOrderData);
        } else if (pathname === "/logout") {
          setItems(wishlist);
        } else if (pathname.startsWith("/results")) {
          const searchQuery = pathname.split("/").pop();
          // console.log("Query working; searchQuery:", searchQuery)
          response = await axios.get("http://localhost:3000/items/search", {
            params: { searchQuery },
          });
          const alphabeticalOrderData = response.data.sort((a, b) =>
            a.name > b.name ? 1 : -1
          );
          setItems(alphabeticalOrderData);
        } else {
          response = await axios.get("http://localhost:3000/items/");
          const alphabeticalOrderData = response.data.sort((a, b) =>
            a.name > b.name ? 1 : -1
          );
          setItems(alphabeticalOrderData);
        }
        console.log(user, "Home")
        // const alphabeticalOrderData = response.data.sort((a, b) =>
        //   a.name > b.name ? 1 : -1
        // );
        // setItems(alphabeticalOrderData);
      } catch (error) {
        console.log(error);
      }
    };

    getItems();

    socket.on("receive_message", (msgs) => {
      setAllMessages(msgs);
      console.log("received");
    });
  }, [pathname, userId]);

  // Update items state when pathname is "/logout"
  // useEffect(() => {
  //   if (pathname === "/logout") {
  //     setItems(wishlist);
  //   }
  // }, [pathname, wishlist]);

  const [selectedUserToChatWith, setSelectedUserToChatWith] = useState(null);
  const [message, setMessage] = useState("");
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [allMessages, selectedUserToChatWith]);

  const startChat = async (toUser) => {
    // console.log(toUser);
    // console.log(toUser.id);
    // console.log(allMessages);
    if (toUser.id === user.id) {
      return;
    }
    console.log(toUser);
    setSelectedUserToChatWith(toUser);
    socket.emit("get_messages", {
      fromUser: user.id,
    });
    console.log(user.socketId)
  };

  const sendMessage = () => {
    console.log(selectedUserToChatWith.socketId, "to");
    console.log(user.socketId, "sender");
    socket.emit("send_message", {
      fromUser: user.id,
      toUser: selectedUserToChatWith.id,
      toFirstName: selectedUserToChatWith.firstName,
      toLastName: selectedUserToChatWith.lastName,
      toSocketId: selectedUserToChatWith.socketId,
      message,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  if (!items) {
    return <h1>loading</h1>;
  } else {
    return (
      <>
        <ShoppingCartButton />
        <Grid container spacing={3}>
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
                          {item.seller[0] ? `${item.seller[0].firstName} ${item.seller[0].lastName[0]}.` : 'No seller'}
                        </Typography>
                        <Typography component="div">
                          {item.description}
                        </Typography>
                        <CardActions sx={{ justifyContent: "space-between" }}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => startChat(item.seller[0])}
                          >
                            Chat
                          </Button>
                          <ReviewButton item={item} itemId={item.id} />
                          <AddToCartButton item={item} />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              handleOpen();
                              setSelectedItemId(item.id);
                            }}
                          >
                            View Details
                          </Button>
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

          <Modal open={open} onClose={handleClose}>
            <div
              style={{
                color: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "50vh",
                width: "50vw",
                position: "fixed",
                top: "25vh",
                left: "25vw",
                backgroundColor: "white",
                opacity: 0.95,
              }}
            >
              <ProductDetail productId={selectedItemId} />
            </div>
          </Modal>
          
          {selectedUserToChatWith && (
            <div
              style={{
                position: "fixed",
                bottom: 16,
                right: 16,
                maxHeight: "50vh",
                width: "40%",
                maxWidth: "100%",
                display: "flex",
                flexDirection: "column",
                outline: "5px solid black",
              }}
            >
              <h3
                style={{
                  margin: "0",
                  padding: "8px",
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                Chatting with {selectedUserToChatWith.firstName}{" "}
                {selectedUserToChatWith.lastName}
              </h3>
              <div
                ref={messageContainerRef}
                style={{
                  maxHeight: "calc(50vh - 40px)",
                  overflowY: "auto",
                  flexGrow: 1,
                  padding: "10px",
                }}
              >
                {allMessages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: msg.toUser === user.id ? "left" : "right",
                      margin: "8px 0",
                    }}
                  >
                    <strong>
                      {msg.fromUser === user.id
                        ? user.firstName
                        : selectedUserToChatWith.firstName}
                      {" - "}
                    </strong>
                    {msg.message}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "8px",
                  alignItems: "flex-end",
                }}
              >
                <input
                  value={message}
                  onChange={(ev) => setMessage(ev.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "black",
                    color: "white",
                    cursor: "pointer",
                    marginTop: "8px",
                  }}
                >
                  Send message
                </button>
              </div>
            </div>
          )}
        </Grid>      
      </>
    );  }
};

export default Home;
