import React, { useState, useEffect } from "react";
import axios from "axios";
// material UI
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";

const ItemCards = ({ item }) => {
  const addItemToShoppingCard = (async) => {};
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
            <Button variant="contained">See Reviews</Button>
            <Button variant="contained">Add to cart</Button>
          </CardActions>
          <Typography variant="h6" component="div">
            ${item.price}.00
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemCards;
