import React, { useState, useEffect } from "react";
import axios from "axios";

import { useSelector } from "react-redux/es/hooks/useSelector";

import { useNavigate, useOutletContext } from "react-router-dom";

import { Box, Grid } from "@mui/material/";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import CartItems from "./CartItems";

const Cart = () => {
  const [formData, setFormData] = useState(null);
  const [outletContext, setOutletContext] = useOutletContext();
  const shoppingCart = outletContext.shoppingCart;

  const navigate = useNavigate();
  const userId = useSelector((state) => state.isAuth?.value?.id);
  // console.log(userId);
  useEffect(() => {
    const initialFormData = shoppingCart.map((item) => ({
      itemId: item.id,
      amount: 0,
    }));
    setFormData(initialFormData);
  }, []);

  const checkOut = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.patch(
        "http://localhost:3000/items/checkOut",
        formData,
        {
          params: { userId: userId },
        }
      );

      const token = response.data;
      window.localStorage.setItem("token", token);
      setOutletContext({
        ...outletContext,
        shoppingCart: []
      })
      // setShoppingCart([]);
      navigate("/");
      console.log("checkout");
    } catch (error) {
      console.log(error);
    }
  };

  const clearShoppingCart = async () => {
    // console.log(userId)
    try {
      const response = await axios.patch(
        `http://localhost:3000/items/clearShoppingCart/`,
        {},
        {
          params: { userId: userId },
        }
      );
      setOutletContext({
        ...outletContext,
        shoppingCart: []
      })
      // setShoppingCart([]);
    } catch (error) {
      console.log(error);
    }
  };
  if (shoppingCart.length === 0) {
    return <h1>Cart is empty or loading</h1>;
  } else {
    // console.log(shoppingCart);

    return (
      <>
        <h1>shopping cart</h1>
        <Button variant="contained" color="error" onClick={clearShoppingCart}>
          Clear shopping cart
        </Button>
        <Grid container spacing={1}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container item xs={8} spacing={2} columns={2}>
              {shoppingCart.map((item, idx) => {
                return (
                  <Grid item xs={12} key={idx}>
                    <CartItems
                      item={item}
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Divider />
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
