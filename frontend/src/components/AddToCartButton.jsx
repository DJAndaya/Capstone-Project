import React, { useState, useEffect } from "react";
import axios from "axios";
// redux
import { useSelector } from "react-redux";
// router
import { useNavigate } from "react-router-dom";
// components
import { Button } from "@mui/material";

const AddToCartButton = ({ item }) => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [itemInShop, setItemInShop] = useState(false);

  const userId = useSelector((state) => state.isAuth?.value?.id);
  const navigate = useNavigate();

  useEffect(() => {
    // itemInCartCheck()
    const storedShoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    setShoppingCart(storedShoppingCart);
  }, [item, userId]);

  const addRemoveFromShoppingCart = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const patchData = { item, userId };
    try {
      const response = await axios.patch(
        "http://localhost:3000/items/addOrRemoveFromShoppingCart",
        patchData
      );

      const token = response.data;
      window.localStorage.setItem("token", token);

      const shoppingCartResponse = await axios.get(
        `http://localhost:3000/items/shoppingCart/`,
        {
          params: { userId: userId },
        }
      );
      const alphabeticalOrderData = shoppingCartResponse.data.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });

      const isItemInShoppingCart = alphabeticalOrderData.some(
        (cartItem) => cartItem.id === item.id
      );
      setItemInShop(isItemInShoppingCart);
      localStorage.setItem("shoppingCart", JSON.stringify(alphabeticalOrderData));
    } catch (error) {
      console.log(error);
    }
  };

  const itemInCartCheck = () => {
    const isItemInShoppingCart = shoppingCart.some(
      (cartItem) => cartItem.id === item.id
    );
    setItemInShop(isItemInShoppingCart);
  };
  //   itemInCartCheck()

  return (
    <>
      {!itemInShop || !userId ? (
        <Button variant="contained" onClick={addRemoveFromShoppingCart}>
          Add to cart
        </Button>
      ) : (
        <Button
          variant="contained"
          color="error"
          onClick={addRemoveFromShoppingCart}
        >
          Remove from cart
        </Button>
      )}
    </>
  );
};

export default AddToCartButton;
