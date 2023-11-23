import React, { useState } from "react";

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
  const itemId = item.id;

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
