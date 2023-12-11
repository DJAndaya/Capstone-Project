import React, { useState } from "react";

import { useOutletContext } from "react-router-dom";

import { Box, Grid, Paper } from "@mui/material/";
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
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import AddToCartButton from "./AddToCartButton";

const CartItems = ({ item }) => {
  return (
    <Paper elevation={4}>
      <h2>
        {item.item.name}
        <AddToCartButton sx={{ float: "right", marginRight: "10px" }} item={item.item}/>
      </h2>
      {/* <CardContent>
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
          <AddToCartButton item={item.item} />
          <BasicTextField item={item} />
        </CardActions>
      </CardContent> */}
    </Paper>
  );
};

const BasicTextField = ({ item }) => {
  const [outletContext, setOutletContext] = useOutletContext();
  const shoppingCart = outletContext.shoppingCart;
  const currentItem = item.item;
  const initialPurchaseAmount = shoppingCart.find((cartItem) => cartItem.item.id === currentItem.id).purchaseAmount;
  const [customAmount, setCustomAmount] = useState(initialPurchaseAmount);
  const [showWarning, setShowWarning] = useState(false);

  const handleInputChange = (event) => {
    const amount = parseInt(event.target.value);

    if (amount > currentItem.amount) {
      setShowWarning(true);
      setCustomAmount(currentItem.amount)
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
    } else {
      setShowWarning(false);
      setCustomAmount(amount);
      addPurchaseAmountToShoppingCart(currentItem, amount);
    }
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
        sx={{ width: "130%" }}
        inputProps={{ min: 1, max: currentItem.amount }}
      />
      {showWarning && (
        <Alert severity="error" sx={{ marginTop: 1 }}>
          The entered amount exceeds the current stock.
        </Alert>
      )}
    </Box>
  );
};

export default CartItems;