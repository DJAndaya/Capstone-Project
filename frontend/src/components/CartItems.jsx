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

import AddToCartButton from "./AddToCartButton";

const CartItems = ({ item, formData, setFormData }) => {

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {item.item.name}
        </Typography>
        <Typography variant="h7" component="div">
          Seller Name
        </Typography>
        <Typography variant="h6" component="div">
          ${item.item.price}
        </Typography>
        <CardActions>
          {/* <Button variant="contained">See Reviews</Button> */}
          <AddToCartButton item={item.item} />
          <BasicSelect
            item={item}
            formData={formData}
            setFormData={setFormData}
          />
          <Divider />
        </CardActions>
      </CardContent>
    </Card>
  );
};

const BasicSelect = ({ item, formData, setFormData }) => {
  const [newAmount, setNewAmount] = useState(1);
  const [outletContext, setOutletContext] = useOutletContext();
  const shoppingCart = outletContext.shoppingCart;
  // console.log(shoppingCart)
  const currentItem = item.item
  const handleChange = (event) => {
    const amount = event.target.value;
    setNewAmount(amount);
    // console.log(amount);
    updateFormData(currentItem, amount);
  };
  

  const updateFormData = (currentItem, amount) => {
    const newShoppingCartData = shoppingCart.map((cartItem) => {
      return cartItem.item.id === currentItem.id ? { ... cartItem, amount: amount } : cartItem
    })
    // console.log(newShoppingCartData)
        setOutletContext((prevContext) => ({
      ...prevContext,
      shoppingCart: newShoppingCartData
  }))
  };
  

  const renderMenuItem = () => {
    const items = [];
    for (let i = 1; i <= 9; i++) {
      items.push(
        <MenuItem value={i} key={i}>
          {i}
        </MenuItem>
      );
    }

    return items;
  };
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>Amount</InputLabel>
        <Select value={newAmount} label="Amount" onChange={handleChange}>
          {renderMenuItem()}
          <Divider />
          <MenuItem value={10}>10+</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default CartItems;
