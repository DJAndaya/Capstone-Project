import React, { useState, useEffect } from "react";
import axios from "axios";
// material UI
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
// redux
import { useSelector } from "react-redux";
// router
import { useNavigate } from "react-router-dom";

const ItemCards = ({ item }) => {
  const seeReviews = () => {};
  const userId = useSelector((state) => state.isAuth?.value?.id);
  const navigate = useNavigate()

  const addItemToShoppingCard = async () => {
    // const [item, setItem] = useState({})
    const itemId = item.id;
    // console.log(userId);
    // console.log(itemId);
    const patchData = {item, userId}
    if (!userId) {
      navigate("/login")
    } else {
      try {
        const response = await axios.patch(
          "http://localhost:3000/items/addToShoppingCart",
          patchData
        );

        const token = response.data;
        window.localStorage.setItem("token", token);
        // console.log(response.data)
        if (response) {
          console.log("it worked");
        }
      } catch (error) {
        console.log(error);
      }
    }
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
            {/* <Button variant="contained">See Reviews</Button> */}
            <Button variant="contained" onClick={addItemToShoppingCard}>
              Add to cart
            </Button>
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
