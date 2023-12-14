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
import AddToCartButton from "./AddToCartButton";

export default function ItemsSelling() {
  const [itemsSelling, setItemsSelling] = useState([]);
  const isAuth = useSelector(selectIsAuth);
  // console.log(itemsSelling);
  useEffect(() => {
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
        // console.log(error);
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
            userId: isAuth.id
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
      // console.log(error);
    }
  };

  return (
    <>
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
    </>
  );
}
