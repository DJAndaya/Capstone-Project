import React, { useState, useEffect } from "react";
import axios from "axios";
// redux
import { useSelector, useDispatch } from "react-redux";
import { updateShoppingCart } from "../redux/shoppingCartSlice";
// router
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
// components
import { Button } from "@mui/material";

const AddToCartButton = ({ item }) => {
  // const [shoppingCart, setShoppingCart] = useState([]);
  const [itemInShop, setItemInShop] = useState(false);

  const userId = useSelector((state) => state.isAuth?.value?.id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [shoppingCart, setShoppingCart] = useOutletContext();
  let isItemInShoppingCart = shoppingCart.some(
    (cartItem) => cartItem.id === item.id
  );

  useEffect(() => {
    const getShoppingCartData = async () => {
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
      setShoppingCart(alphabeticalOrderData);
    };
  }, [item, userId, location.pathname]);

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
      setShoppingCart(alphabeticalOrderData);
      // localStorage.setItem("shoppingCart", JSON.stringify(alphabeticalOrderData));
      itemInCartCheck();
    } catch (error) {
      console.log(error);
    }
  };

  const itemInCartCheck = () => {
    isItemInShoppingCart = shoppingCart.some(
      (cartItem) => cartItem.id === item.id
    );
    // setItemInShop(isItemInShoppingCart);
  };
  //   itemInCartCheck()

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

/* Plans to fix button issue

1. use outlet context to create a state, the state will store array of items
2. make a variable with .find if the item.id matches an item in the state
3. the button either removes or adds the item from the array depending on if it's a remove or add 

*/

/* Changes needed to fix 



*/