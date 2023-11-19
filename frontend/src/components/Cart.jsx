import React, { useState, useEffect } from "react";
import axios from "axios";

import { useSelector } from "react-redux/es/hooks/useSelector";

import { Box, Grid } from "@mui/material/";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";

const Cart = () => {
  const [shoppingCart, setShoppingCart] = useState([]);

  const userId = useSelector((state) => state.isAuth?.value?.id);
  // console.log(userId);
  useEffect(() => {
    const getShoppingCartItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/items/shoppingCart/`,
          {
            params: { userId: userId },
          }
        );
        const alphabeticalOrderData = response.data.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        setShoppingCart(alphabeticalOrderData);
      } catch (error) {
        console.log(error);
      }
    };
    getShoppingCartItems();
  }, []);

  const removeFromShoppingCart = async () => {
    console.log("removed from cart works");
  };

  const checkOut = () => {
    console.log("checkout works");
  };
  if (!shoppingCart) {
    return <h1>loading</h1>;
  } else {
    // console.log(shoppingCart);

    return (
      <>
        <h1>shopping cart</h1>
        <Grid container spacing={1}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container item xs={8} spacing={2} columns={2}>
              {shoppingCart.map((item, idx) => {
                return (
                  <Grid item xs={12} key={idx}>
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
                          <Button
                            variant="contained"
                            onClick={removeFromShoppingCart}
                          >
                            Remove from cart
                          </Button>
                        </CardActions>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Grid item xs={4}>
            <Card>
              <CardActions>
                <Button variant="contained" onClick={checkOut}>
                  Checkout
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  }
};

export default Cart;
