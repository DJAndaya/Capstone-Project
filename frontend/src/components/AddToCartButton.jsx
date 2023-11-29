import React, { useEffect } from "react";
// redux
import { useSelector } from "react-redux";
// router
import { useOutletContext } from "react-router-dom";
// components
import { Button } from "@mui/material";

const AddToCartButton = ({ item }) => {
  const userId = useSelector((state) => state.isAuth?.value?.id);

  const [outletContext, setOutletContext] = useOutletContext();
  const shoppingCart = outletContext.shoppingCart;
  let isItemInShoppingCart = shoppingCart.some(
    (cartItem) => cartItem.id === item.id
  );

  const addRemoveFromShoppingCart = () => {
    if (isItemInShoppingCart) {
      const updatedShoppingCart = shoppingCart.filter((shoppingCartItem) => {
        return shoppingCartItem.id !== item.id;
      });
      setOutletContext({
        ...outletContext,
        shoppingCart: updatedShoppingCart,
      });
      // setShoppingCart(updatedShoppingCart);
    } else {
      setOutletContext({
        ...outletContext,
        shoppingCart: [...outletContext.shoppingCart, item],
      });
      // setShoppingCart([...shoppingCart, item]);
    }
  };

  // useEffect(() => {
  //   console.log(outletContext.shoppingCart);
  // }, [outletContext.shoppingCart]);

  return (
    <>
      {!isItemInShoppingCart ? (
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
