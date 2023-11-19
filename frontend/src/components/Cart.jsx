import React, { useState, useEffect } from "react";
import axios from "axios";

import { useSelector } from "react-redux/es/hooks/useSelector";

const Cart = () => {
  const [shoppingCart, setShoppingCart] = useState([]);

  const userId = useSelector((state) => state.isAuth?.value?.id);
  console.log(userId)
  useEffect(() => {
    const getShoppingCartItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/items/shoppingCart/`, {
            params: {userId: userId}
          }
        );
        const alphabeticalOrderData = response.data.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        setShoppingCart(alphabeticalOrderData)
      } catch (error) {
        console.log(error)
      }
    };
    getShoppingCartItems()
  }, []);

  if (!shoppingCart) {
    return <h1>loading</h1>
  } else {
    console.log(shoppingCart)

    return (
      <h1>shopping cart</h1>
    )
  }
};

export default Cart;
