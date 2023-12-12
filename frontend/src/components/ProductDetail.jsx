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
    // console.log(toUser);
    // console.log(toUser.id);
    // console.log(allMessages);
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
            onClick={() => startChat(selectedItem.seller[0].firstName)}
          >
            Chat with Seller
          </Button>
        </p>
        <p>Price: ${selectedItem.price}</p>
        <p>Amount in Stock: {selectedItem.amount}</p>
        {console.log(selectedItem.images)}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <h3 style={{ margin: "0" }}>
              Chatting with {selectedUserToChatWith.firstName}{" "}
              {selectedUserToChatWith.lastName}
            </h3>
            <button
              onClick={() => setSelectedUserToChatWith(null)}
              style={{
                backgroundColor: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {allMessages.map((msg, index) => {
              if (
                msg.toUser === selectedUserToChatWith.id ||
                msg.fromUser === selectedUserToChatWith.id
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
          </div>
    <div>
      <h1>{selectedItem.name}</h1>
      <p>
        {selectedItem.seller[0].firstName} {selectedItem.seller[0].lastName[0]}.
        <Button
          variant="contained"
          color="secondary"
          onClick={() => startChat(selectedItem.seller[0].firstName)}
        >
          Chat with Seller
        </Button>
      </p>
      <p>Price: ${selectedItem.price}</p>
      <p>Amount in Stock: {selectedItem.amount}</p>
      {/* {console.log(selectedItem.images)} */}
      <img src={selectedItem.images} alt="item image"/>
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
        <h3 style={{color: "white"}}>You are chatting with {selectedUserToChatWith.socketId}</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {allMessages.map((msg, index) => {
            if (
              msg.toUser === selectedUserToChatWith.id ||
              msg.fromUser === selectedUserToChatWith.id
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
        </div>

          <div style={{ position: "absolute", bottom: 0, marginTop: "auto" }}>
            <input
              value={message}
              onChange={(ev) => setMessage(ev.target.value)}
            />
            <button onClick={sendMessage}>Send message</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductDetail;
