import React, { useState, useEffect } from "react";
import axios from "axios";

import { useSelector } from "react-redux/es/hooks/useSelector";

import { useNavigate, useOutletContext } from "react-router-dom";

import { Box, Grid, Paper } from "@mui/material/";
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
  // const [formData, setFormData] = useState(null);
  const [outletContext, setOutletContext] = useOutletContext();
  const shoppingCart = outletContext.shoppingCart;
  console.log(shoppingCart);

  const navigate = useNavigate();
  const userId = useSelector((state) => state.isAuth?.value?.id);
  // console.log(userId);
  // useEffect(() => {
  //   const initialFormData = shoppingCart.map((item) => ({
  //     item: item,
  //     purchaseAmount: 1,
  //   }));
  //   setFormData(initialFormData);
  // }, []);

  useEffect(() => {
    if (userId && shoppingCart.length === 0) {
      const getUserShoppingCartData = async () => {
        const response = await axios.get(
          "http://localhost:3000/items/shoppingCart",
          {
            params: { userId },
          }
        );
        let userShoppingCart = response.data;

        userShoppingCart = userShoppingCart.map((cartItem) => ({
          item: cartItem,
          purchaseAmount: 1,
        }));
        setOutletContext({
          ...outletContext,
          shoppingCart: userShoppingCart,
        });
      };
      getUserShoppingCartData();
    }
  }, []);

  const totalAmountPrice = shoppingCart.reduce((total, item) => {
    const totalPriceOfItem = item.purchaseAmount * item.item.price;
    return total + totalPriceOfItem;
  }, 0);

  const checkOut = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    if (!shoppingCart) {
      navigate("/");
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
            Authorization: `Bearer ${await stripe._apiKey}`,
          },
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
  if (shoppingCart.length === 0) {
    return <h1>Cart is empty or loading</h1>;
  } else {
    // console.log(shoppingCart);

    return (
      <>
        {/* <Grid container spacing={1}>
          <Grid item xs={8} sx={{ maxWidth: "100%" }}> */}
        <Paper
          sx={{
            color: "black",
            maxWidth: "100%",
            overflowY: "auto",
            maxHeight: "85vh",
            backgroundColor: "white",
          }}
        >
          <h1>
            Shopping Cart
            <Button
              variant="contained"
              color="error"
              onClick={clearShoppingCart}
              sx={{ float: "right", marginRight: "10px" }}
            >
              Clear shopping cart
            </Button>
          </h1>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} columns={2}>
              {shoppingCart.map((item, idx) => {
                return (
                  <Grid item xs={12} key={idx}>
                    <CartItems
                      item={item}
                      // formData={formData}
                      // setFormData={setFormData}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <h2>
            Total Amount ${totalAmountPrice}
          <Button
            variant="contained"
            onClick={checkOut}
            sx={{ float: "right", marginRight: "10px" }}
          >
            Checkout
          </Button></h2>

        </Paper>
        {/* </Grid> */}
        {/* <Divider />
          <Grid item xs={4}>
            <Paper
              sx={{
                color: "black",
                maxWidth: "100%",
                overflowY: "auto",
                maxHeight: "85vh",
                backgroundColor: "white",
              }}
            >
              <h1>Checkout</h1>
              {shoppingCart.map((item, idx) => {
                const totalPriceOfItem = item.purchaseAmount*item.item.price
                    return (
                      <Paper elevation={2}>
                        <h1>{item.item.name}</h1>
                        <h2>${totalPriceOfItem}</h2>
                      </Paper>
                    );
                  })}
                  <h1>Total Amount: ${totalAmountPrice}</h1>
              <Elements stripe={initializeStripe()}>
                <Button variant="contained" onClick={checkOut}>
                  Checkout
                </Button>
              </Elements>
            </Paper>
          </Grid> */}
        {/* </Grid> */}
      </>
    );
  }
};

export default Cart;
