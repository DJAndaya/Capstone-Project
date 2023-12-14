import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";

import ImageCarousel from "./ImageCarousel";

import { Button, Divider, Paper } from "@mui/material";

import socketio from "socket.io-client";

const socket = socketio("http://localhost:3000");

function ProductDetail({ selectedItem }) {
  const dispatch = useDispatch();
  const { productId: routeProductId } = useParams();
  // const id = propProductId || routeProductId;
  // const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedUserToChatWith, setSelectedUserToChatWith] = useState(null);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const messageContainerRef = useRef(null);

  const user = useSelector(selectIsAuth);
  const userId = useSelector((state) => state.isAuth?.value?.id);
  // console.log("selected item seller", selectedItem.seller[0].lastName[0]);
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     const response = await fetch(
  //       `http://localhost:3000/admin/allproducts/${id}`
  //     );
  //     const data = await response.json();
  //     setProduct(data);
  //   };

  //   fetchProduct();
  // }, [id]);

  useEffect(() => {
    if (user) {
      console.log("testingInIfUser");
      socket.emit("user_joined", user);
      socket.on("update_socket", (updatedUserData) => {
        console.log("productupdateuserdetails:", updatedUserData); // not showing up
        dispatch(setIsAuth(updatedUserData));

        // console.log(updatedUserData);
        // console.log(user, "App")
        // console.log("user info after dispatch:", user) // not showing up
        socket.emit("myId", {});
      });
    }
    console.log("testing");
    socket.emit("myId", {});
    console.log(user, "mounting");
    socket.emit("myId", {});
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [allMessages, selectedUserToChatWith]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (selectedItem) {
        const response = await fetch(
          `http://localhost:3000/reviews/itemReviews/${selectedItem.id}`
        );
        const data = await response.json();
        setReviews(data);
      }
    };

    fetchReviews();
    // console.log("do i run alot")
    socket.on("receive_message", (msgs) => {
      setAllMessages(msgs);
      console.log(allMessages, "received");
    });
  }, [selectedItem?.id, userId]);

  const startChat = async (toUser) => {
    console.log("touser:", toUser);

    // console.log(toUser);
    // console.log(toUser.id);
    // console.log(allMessages);
    if (toUser.socketId === user.socketId) {
      return;
    }
    setSelectedUserToChatWith(toUser, "setting");
    socket.emit("get_messages", {
      fromUser: user.id,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const inputRef = useRef(null);

  const sendMessage = () => {
    socket.emit("myId", {});
    if (message.trim() && selectedUserToChatWith) {
      socket.emit("myId", {});
      console.log(selectedUserToChatWith, "send");
      console.log(user, "sendUserInfo");
      socket.emit("send_message", {
        fromUser: user.id,
        toUser: selectedUserToChatWith.id,
        toFirstName: selectedUserToChatWith.firstName,
        toLastName: selectedUserToChatWith.lastName,
        toSocketId: selectedUserToChatWith.socketId,
        message,
      });
      setMessage("");
      inputRef.current.focus();
      socket.emit("myId", {});
    }
  };

  if (!selectedItem) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Paper sx={{ width: "98%", margin: "auto" }} elevation={4}>
        <h1>{selectedItem.name}</h1>
        <div>
          {selectedItem.seller && selectedItem.seller[0]
            ? `${selectedItem.seller[0].firstName} ${selectedItem.seller[0].lastName[0]}.`
            : ""}
        </div>
        {user.admin ? null : (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => startChat(selectedItem.seller[0])}
          >
            Chat with Seller
          </Button>
        )}
        <div>Price: ${selectedItem.price}</div>
        <div>Amount in Stock: {selectedItem.amount}</div>
        {/* {console.log(selectedItem.images)} */}
        {/* <img src={selectedItem.images[0] ? selectedItem.images[0].imageUrl : ""} alt="item image" /> */}
        <ImageCarousel item={selectedItem} />
        <div>Description: {selectedItem.description}</div>
        {/* <div>Category: {selectedItem.category}</div> */}
        <br />
        <div>Reviews:</div>
        <br />
        {reviews.map((review, index) => (
          <Paper
            sx={{
              width: "98%",
              margin: "auto",
              padding: "0.5%",
              marginBottom: "10px",
            }}
            elevation={4}
          >
            {console.log("review:", review)}
            <div style={{ fontSize: "15px", fontWeight: "bold" }}>
              Rating: {review.rating}/5
            </div>
              <div>{review.comment}</div>
            <Divider />
          </Paper>
          // <ul key={index}>
          //   <li>
          //     <div>
          //       <p>Rating: {review.rating}</p>
          //       <p>Comment: {review.comment}</p>
          //     </div>
          //   </li>
          // </ul>
        ))}
        <br />
      </Paper>

      {selectedUserToChatWith && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            height: "40vh",
            width: "40%",
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            outline: "5px solid black",
            backgroundColor: "black",
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
            <button
              onClick={() => setSelectedUserToChatWith(null)}
              style={{
                position: "absolute",
                right: "10px",
                color: "white",
                backgroundColor: "black",
              }}
            >
              X
            </button>{" "}
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
            {allMessages.map(
              (msg, index) =>
                (msg.fromUser === selectedUserToChatWith.id ||
                  msg.toUser === selectedUserToChatWith.id) && (
                  <div
                    key={index}
                    style={{
                      textAlign: msg.toUser === user.id ? "left" : "right",
                      margin: "8px 0",
                      color: "white",
                    }}
                  >
                    <strong>
                      {msg.fromUser === selectedUserToChatWith.id &&
                      (msg.toUser = user.id)
                        ? selectedUserToChatWith.firstName
                        : user.firstName}
                      {" - "}
                    </strong>
                    {msg.message}
                  </div>
                )
            )}
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
              ref={inputRef}
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
    </>
  );
}

export default ProductDetail;
