import React, { useState, useEffect } from "react";
import axios from "axios";

import { useSelector } from "react-redux/es/hooks/useSelector";

import { Box, Grid } from "@mui/material/";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";

import AddToCartButton from "./AddToCartButton";

const CartItems = ({ item, formData, setFormData }) => {
  //   const [amount, setAmount] = useState(1);

  const userId = useSelector((state) => state.isAuth?.value?.id);
  const itemId = item.id;

  const removeFromShoppingCart = async () => {
    // console.log("removed from cart works");
    const patchData = { item, userId };
    try {
      const response = await axios.patch(
        "http://localhost:3000/items/addOrRemoveFromShoppingCart",
        patchData
      );

      const token = response.data;
      window.localStorage.setItem("token", token);
      // console.log(response.data)
      // if (response) {
      //   console.log("it worked");
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {item.name}
        </Typography>
        <Typography variant="h7" component="div">
          Seller Name
        </Typography>
        <Typography variant="h6" component="div">
          ${item.price}
        </Typography>
        <CardActions>
          {/* <Button variant="contained">See Reviews</Button> */}
          <AddToCartButton item={item} />
          <BasicSelect
            itemId={itemId}
            formData={formData}
            setFormData={setFormData}
          />
          <Divider />
        </CardActions>
      </CardContent>
    </Card>
  );
};

const BasicSelect = ({ itemId, formData, setFormData }) => {
    const [newAmount, setNewAmount] = useState(1);

  const handleChange = (event) => {
    setNewAmount(event.target.value);
    updateFormData(itemId, newAmount);
  };

  const updateFormData = (itemId, newAmount) => {
    setFormData((prevFormData) =>
      prevFormData.map((item) =>
        item.itemId === itemId ? { ...item, amount: newAmount } : item
      )
    );
  };

  const renderMenuItem = () => {
    const items = [];
    for (let i = 1; i <= 9; i++) {
      items.push(<MenuItem value={i} key={i}>{i}</MenuItem>);
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
