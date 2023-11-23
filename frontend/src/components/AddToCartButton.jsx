import React from "react";
// redux
import { useSelector } from "react-redux";
// router
import { useOutletContext } from "react-router-dom";
// components
import { Button } from "@mui/material";

const AddToCartButton = ({ item }) => {
  const userId = useSelector((state) => state.isAuth?.value?.id);

  const [shoppingCart, setShoppingCart] = useOutletContext();
  let isItemInShoppingCart = shoppingCart.some(
    (cartItem) => cartItem.id === item.id
  );

  const addRemoveFromShoppingCart = () => {
    if (isItemInShoppingCart) {
      const updatedShoppingCart = shoppingCart.filter((shoppingCartItem) => {
        return shoppingCartItem.id !== item.id;
      });
      setShoppingCart(updatedShoppingCart);
    } else {
      setShoppingCart([...shoppingCart, item]);
    }
  };

  return (
    <>
      {!isItemInShoppingCart || !userId ? (
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
