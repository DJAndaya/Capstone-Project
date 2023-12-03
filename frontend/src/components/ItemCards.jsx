import React, { useState } from "react";
// material UI
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import AddToCartButton from "./AddToCartButton";
import AddToWishListButton from "./AddToWishListButton";
import ReviewButton from "./ReviewButton";

const ItemCards = ({ item, user }) => {
  const seeReviews = () => {};

  const [selectedUserToChatWith, setSelectedUserToChatWith] = useState(null);
  const [message, setMessage] = useState("");

  const startChat = async (toUser) => {
    if (toUser.socketId === user.socketId) {
      return;
    }
    setSelectedUserToChatWith(toUser);
  };

  const sendMessage = () => {
    socket.emit("send_message", {
      fromUser: user.id,
      toUser: selectedUserToChatWith.user.id,
      message,
    });
  };
  
  return (
    <div>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {item.name}
          </Typography>
          <Typography variant="h7" component="div">
            Seller Name
          </Typography>
          <Typography component="div">{item.description}</Typography>
          <CardActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => startChat(user)}
            >
              Chat
            </Button>
            <ReviewButton itemId={itemId} isAuth={isAuth} />
            <AddToCartButton item={item} />
            <AddToWishListButton item={item} />
          </CardActions>
          <Typography variant="h6" component="div">
            ${item.price}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemCards;
