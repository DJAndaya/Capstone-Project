import React, { useState } from "react";

import { useOutletContext } from "react-router-dom";

import { Box, Grid } from "@mui/material/";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

import AddToCartButton from "./AddToCartButton";

const CartItems = ({ item }) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {item.item.name}
        </Typography>
        <Typography variant="caption" component="div">
          Amount In Stock: {item.item.amount}
        </Typography>
        <Typography variant="h6" component="div">
          ${item.item.price}
        </Typography>
        <CardActions>
          {/* <Button variant="contained">See Reviews</Button> */}
          <AddToCartButton item={item.item} />
          <BasicTextField item={item} />
          <Divider />
        </CardActions>
      </CardContent>
    </Card>
  );
};

const BasicTextField = ({ item }) => {
  const [customAmount, setCustomAmount] = useState(1);
  const [outletContext, setOutletContext] = useOutletContext();
  const shoppingCart = outletContext.shoppingCart;
  const currentItem = item.item;

  // console.log(shoppingCart)
  const handleInputChange = (event) => {
    const amount = parseInt(event.target.value);
    setCustomAmount(amount);
    // Update the formData or shoppingCart as needed
    addPurchaseAmountToShoppingCart(currentItem, amount);
  };

  const addPurchaseAmountToShoppingCart = (currentItem, amount) => {
    const newShoppingCartData = shoppingCart.map((cartItem) => {
      return cartItem.item.id === currentItem.id
        ? { ...cartItem, purchaseAmount: amount }
        : cartItem;
    });
    setOutletContext((prevContext) => ({
      ...prevContext,
      shoppingCart: newShoppingCartData,
    }));
  };

  return (
    <Box sx={{ minWidth: 20 }}>
      <TextField
        type="number"
        label="Amount"
        value={customAmount}
        onChange={handleInputChange}
        sx={{ width: "100%" }}
        inputProps={{min: 1, max: currentItem.amount}}
      />
    </Box>
  );
};

export default CartItems;
