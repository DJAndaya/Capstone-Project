import React, { useState, useEffect } from "react";
import axios from "axios";

import { useSelector } from "react-redux/es/hooks/useSelector";

import { useNavigate, useOutletContext } from "react-router-dom";

import { Box, Grid } from "@mui/material/";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// import stripePromise from "./stripe";
// import initializeStripe from "./stripe";

import CartItems from "./CartItems";
import initializeStripe from "./stripe";

const Cart = () => {
  const [formData, setFormData] = useState(null);
  const [outletContext, setOutletContext] = useOutletContext();
  const shoppingCart = outletContext.shoppingCart;
  // console.log(shoppingCart)

  const navigate = useNavigate();
  const userId = useSelector((state) => state.isAuth?.value?.id);
  // console.log(userId);
  useEffect(() => {
    const initialFormData = shoppingCart.map((item) => ({
      item: item,
      amount: 1,
    }));
    setFormData(initialFormData);
  }, []);

  const checkOut = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      const stripe = await initializeStripe();
      // console.log(stripe._apiKey)
      // const stripePublicKey = stripe._apiKey
      // console.log("formData for checkout:",formData)
      const response = await axios.patch(
        "http://localhost:3000/items/checkOut",
        shoppingCart,
        {
          params: { userId: userId },
          headers: {
            'Authorization': `Bearer ${await stripe._apiKey}`,
          }
        }
      );

      const { sessionId, token } = response.data;

      const result = stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        console.error(result.error.message);
      }

      window.localStorage.setItem("token", token);
      setOutletContext({
        ...outletContext,
        shoppingCart: [],
      });
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

      const token = response.data;
      window.localStorage.setItem("token", token);
      setOutletContext({
        ...outletContext,
        shoppingCart: [],
      });
      // setShoppingCart([]);
    } catch (error) {
      console.log(error);
    }
  };
  if (!shoppingCart) {
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
                <Elements stripe={initializeStripe()}>
                  <Button variant="contained" onClick={checkOut}>
                    Checkout
                  </Button>
                </Elements>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  }
};

export default Cart;