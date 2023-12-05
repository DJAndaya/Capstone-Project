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
import { yellow } from '@mui/material/colors'
import { NavLink, useNavigate } from "react-router-dom";

export default function Sell() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.isAuth?.value?.id)
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
    <div>
      <div>
        <h1>Sell Item</h1>
        <form onSubmit={onSubmit}>
          <input
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
          />
          <input
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            name="price"
          />
          <input
            placeholder="Amount"
            value={formData.amount}
            onChange={handleInputChange}
            name="amount"
          />
          <input
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
            name="category"
          />
          <input
            placeholder="Desciption"
            value={formData.description}
            onChange={handleInputChange}
            name="description"
          />
          <button type="submit">Sell</button>
        </form>
      </div>
      <h1>Items I'm Selling</h1>
      <Grid container spacing={3}>
        {itemsSelling.map((item, index) => {
          return (
            <Grid key={index} item xs={2}>
              <Card style={{ position: "relative" }}>
                {/* <CardMedia
                  onClick={() => window.open(restaurant.googleUrl, "_blank")}
                  sx={{ height: 100, width: "100%" }}
                  image={restaurant.imageUrl}
                /> */}
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
                  {/* <div style={{ display: "flex" }}> */}
                    <Typography align={"center"} sx={{ fontSize: 14 }}>
                      Amount: {item.amount}
                    </Typography>
                    {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <IconButton sx={{ color: yellow[500], margin: -4 }}>
                        <ArrowUpwardIcon sx={{ padding: 4 }} />
                      </IconButton>
                      <IconButton sx={{ color: yellow[500], margin: -4 }}>
                        <ArrowDownwardIcon sx={{ padding: 4 }} />
                      </IconButton>
                    </div> */}
                  {/* </div> */}
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
  );
}
