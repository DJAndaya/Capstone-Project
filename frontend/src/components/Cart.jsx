import React, { useState, useEffect } from "react";
import axios from "axios";

import { useSelector } from "react-redux/es/hooks/useSelector";

import { useNavigate } from "react-router-dom";

import { Box, Grid } from "@mui/material/";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import CartItems from "./CartItems";

const Cart = () => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [formData, setFormData] = useState(null);
  const [amount, setAmount] = useState(1);

  const navigate = useNavigate();
  const userId = useSelector((state) => state.isAuth?.value?.id);
  // console.log(userId);
  useEffect(() => {
    const getShoppingCartItems = async () => {
      // console.log(userId)
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
        const initialFormData = alphabeticalOrderData.map((item) => ({
          itemId: item.id,
          amount: 0,
        }));
        setShoppingCart(alphabeticalOrderData);
        setFormData(initialFormData);
      } catch (error) {
        console.log(error);
      }
    };
    getShoppingCartItems();

  }, []);

  const checkOut = async () => {
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
      navigate("/");
      console.log("checkout");
    } catch (error) {
      console.log(error);
    }
  };

  const clearShoppingCart = async () => {
    console.log(userId)
    try {
      const response = await axios.patch(
        `http://localhost:3000/items/clearShoppingCart/`,
        {},
        {
          params: { userId: userId },
        }
      );
      setShoppingCart([])
    } catch (error) {
      console.log(error)
    }
  }
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

/*

  1. at the beginning, setFormData to be [{id: itemId, amount: 0} x amount of tiems]
  2. create a function called updateFormData, it will something like:
    const updateFormData = (id, newAmount) => {
      setFormData((prevFormData) => {
        prevFormData.map((item) => {
          if (item.id === id) {
            {...item, amount: newAmount}
          }
        })
      })
    }
  3. replace the checkout function with what is now the useEffect that changes when formData changes

copy and pasted data below for storage:

 const checkOut = async () => {
    let updatedFormData = [];
    for (let item of shoppingCart) {
      updatedFormData = [
        ...updatedFormData,
        {
          itemId: item.id,
          amount: amount,
        },
      ];
    }
    setFormData(updatedFormData);
  };
  // console.log(formData)
  useEffect(() => {
    if (formData) {
      console.log(formData);
      const patchRequest = async () => {
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
          navigate("/");
          console.log("checkout");
        } catch (error) {
          console.log(error);
        }
      };
      patchRequest();
    }
  }, [formData]);


*/
