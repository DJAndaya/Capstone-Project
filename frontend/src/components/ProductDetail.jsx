import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";

import { Button } from "@mui/material";

import socketio from "socket.io-client";

const socket = socketio("http://localhost:3000");

function ProductDetail({ selectedItem }) {
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
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [allMessages, selectedUserToChatWith]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(
        `http://localhost:3000/reviews/itemReviews/${selectedItem.id}`
      );
      const data = await response.json();
      setReviews(data);
    };

    fetchReviews();

    socket.on("receive_message", (msgs) => {
      setAllMessages(msgs);
    });
  }, [selectedItem.id, userId]);

  const startChat = async (toUser) => {
    console.log(toUser)

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

  const sendMessage = () => {
    console.log(selectedUserToChatWith, "send");
    socket.emit("send_message", {
      fromUser: user.id,
      toUser: selectedUserToChatWith.id,
      toFirstName: selectedUserToChatWith.firstName,
      toLastName: selectedUserToChatWith.lastName,
      toSocketId: selectedUserToChatWith.socketId,
      message,
    });
  };

  if (!selectedItem) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h1>{selectedItem.name}</h1>
        <p>
          {selectedItem.seller[0].firstName}{" "}
          {selectedItem.seller[0].lastName[0]}.
          <Button
            variant="contained"
            color="secondary"
            onClick={() => startChat(selectedItem.seller[0])}
          >
            Chat with Seller
          </Button>
        </p>
        <p>Price: ${selectedItem.price}</p>
        <p>Amount in Stock: {selectedItem.amount}</p>
        {/* {console.log(selectedItem.images)} */}
        <img src={selectedItem.images} alt="item image" />
        <p>Description: {selectedItem.description}</p>
        <p>Category: {selectedItem.category}</p>
        <p>Reviews:</p>
        {reviews.map((review, index) => (
          <ul key={index}>
            <li>
              <div>
                <p>Rating: {review.rating}</p>
                <p>Comment: {review.comment}</p>
              </div>
            </li>
          </ul>
        ))}
      </div>

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
            {allMessages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.toUser === user.id ? "left" : "right",
                  margin: "8px 0",
                  color: "white"
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
    </>
  );
}

export default ProductDetail;
