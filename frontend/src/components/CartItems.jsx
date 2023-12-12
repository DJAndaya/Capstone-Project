import React, { useState } from "react";
import axios from "axios";

import { useOutletContext } from "react-router-dom";

import { useSelector } from "react-redux";

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
import ClearIcon from "@mui/icons-material/Clear";
import Tooltip from "@mui/material/Tooltip";

import AddToCartButton from "./AddToCartButton";

const CartItems = ({ item }) => {
  const userId = useSelector((state) => state.isAuth?.value?.id);

  const [outletContext, setOutletContext] = useOutletContext();
  const shoppingCart = outletContext.shoppingCart;
  const currentItem = item.item;
  let isItemInShoppingCart = shoppingCart.some(
    (cartItem) => cartItem.item.id === currentItem.id
  );

  const addRemoveFromShoppingCart = async () => {
    if (isItemInShoppingCart) {
      const updatedShoppingCart = shoppingCart.filter((shoppingCartItem) => {
        return shoppingCartItem.item.id !== currentItem.id;
      });
      setOutletContext({
        ...outletContext,
        shoppingCart: updatedShoppingCart,
      });
      // setShoppingCart(updatedShoppingCart);
    } else {
      setOutletContext({
        ...outletContext,
        shoppingCart: [
          ...outletContext.shoppingCart,
          {
            item: item,
            purchaseAmount: 1,
          },
        ],
      });
      // setShoppingCart([...shoppingCart, item]);
    }
    if (userId) {
      try {
        const item = currentItem;
        await axios.patch(
          "http://localhost:3000/items/addOrRemoveFromShoppingCart",
          { item, userId }
        );
      } catch (error) {
        console.log(error);
        // Handle errors as needed
      }
    }
  };

  return (
    <Paper sx={{maxHeigth: "110%"}}>
      <h3>
        {item.item.name}
        <Tooltip title="Remove from cart">
          <ClearIcon
            onClick={addRemoveFromShoppingCart}
            sx={{ float: "right", marginRight: "10px", marginTop: "7px" }}
          />
        </Tooltip>
      </h3>
      <div>Amount In Stock: {item.item.amount}</div>
      <div>Price: ${item.item.price}</div>
      <div>
        <BasicTextField item={item} />
        <span style={{ float: "right", marginRight: "10px", position: "center"}}>
          ${item.purchaseAmount * item.item.price}
        </span>
      </div>
      <br />
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
  const initialPurchaseAmount = shoppingCart.find(
    (cartItem) => cartItem.item.id === currentItem.id
  ).purchaseAmount;
  const [customAmount, setCustomAmount] = useState(initialPurchaseAmount);
  const [showWarning, setShowWarning] = useState(false);

  const handleInputChange = (event) => {
    const amount = parseInt(event.target.value);

    if (amount > currentItem.amount) {
      setShowWarning(true);
      setCustomAmount(currentItem.amount);
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
        sx={{ width: "20%" }}
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
