import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { yellow } from "@mui/material/colors";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sell() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.isAuth?.value?.id);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    amount: "",
    description: "",
    category: "",
  });

  const isAuth = useSelector(selectIsAuth);

  const addItemToSell = async (formData) => {
    try {
      const response = await axios.post("http://localhost:3000/items/sell", {
        formData,
        id: isAuth.id,
      });

      const itemAddedToItemSelling = [...itemsSelling, response.data];
      setItemsSelling(itemAddedToItemSelling);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    addItemToSell(formData);
    setFormData({
      name: "",
      price: "",
      amount: "",
      description: "",
      category: "",
    });
  };

  const [itemsSelling, setItemsSelling] = useState([]);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }

    const getItemsSelling = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/items/getItemsSelling",
          {
            params: {
              userId: isAuth.id,
            },
          }
        );
        setItemsSelling(response.data.sellingItems);
      } catch (error) {
        console.log(error);
      }
    };

    getItemsSelling();
  }, []);

  const removeItem = async (itemId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/items/deleteItemSelling/${itemId}`,
        {
          params: {
            userId: isAuth.id,
          },
        }
      );

      if (response.status === 200) {
        const updatedItemsSelling = itemsSelling.filter(
          (item) => item.id != itemId
        );
        setItemsSelling(updatedItemsSelling);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          width: "12%",
          minWidth: "220px",
          display: "flex",
          flexDirection: "column",
          border: "5px solid black",
          padding: "15px",
          overflowY: "auto",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <h1
          style={{
          }}
        >
          Sell Item
        </h1>
        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px", // Add spacing between inputs
          }}
        >
          <input
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Price (Enter Number)"
            value={formData.price}
            onChange={handleInputChange}
            name="price"
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Amount (Enter Number)"
            value={formData.amount}
            onChange={handleInputChange}
            name="amount"
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
            name="category"
            style={{ padding: "8px" }}
          />
          <input
            placeholder="Desciption"
            value={formData.description}
            onChange={handleInputChange}
            name="description"
            style={{ padding: "8px" }}
          />
          <button type="submit">Sell</button>
        </form>
      </div>
      <div
        style={{
          width: "88%",
          border: "5px solid black",
          padding: "15px",
          overflowY: "auto",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <h1>Items I'm Selling</h1>
        <Grid container spacing={3}>
          {itemsSelling.map((item, index) => {
            return (
              <Grid key={index} item xs={2}>
                <Card style={{ position: "relative" }}>
                  <CardContent>
                    <Typography
                      align={"center"}
                      variant="body1"
                      sx={{ fontWeight: "bold" }}
                    >
                      Name: {item.name}
                    </Typography>
                    <Typography align={"center"} variant="body2">
                      Price: {item.price}
                    </Typography>
                    <Typography align={"center"} sx={{ fontSize: 14 }}>
                      Amount: {item.amount}
                    </Typography>
                    <Typography align={"center"} sx={{ fontSize: 14 }}>
                      Category: {item.category}
                    </Typography>
                    <Typography align={"center"} sx={{ fontSize: 14 }}>
                      Description: {item.description}
                    </Typography>
                    <CardActions style={{ justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove Item
                      </Button>
                    </CardActions>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}
