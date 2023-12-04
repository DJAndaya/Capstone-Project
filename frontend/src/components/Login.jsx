 import React, { useState, useEffect } from "react";
import axios from "axios";

import { setIsAuth } from "../redux/isAuthSlice";
import { useDispatch } from "react-redux";

import { NavLink, useNavigate, useOutletContext } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [outletContext, setOutletContext] = useOutletContext();
  const wishList = outletContext.wishList
  const shoppingCartItems = outletContext.shoppingCart.map(object => object.item)
  const shoppingCart = outletContext.shoppingCart

  const loginUser = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        formData
      );

      const token = response.data;

      window.localStorage.setItem("token", token);

      const userResponse = await axios.get(
        "http://localhost:3000/auth/loggedin",
        {
          headers: {
            authorization: token,
          },
        }
      );
        
      let user = userResponse.data;
      dispatch(setIsAuth(user));

      // putting DB wishlist and shopping cart into local respectively
      const userWishList = user.wishList || []
      const userShoppingCart = user.shoppingCart || []
      const combinedWishList = wishList.concat(userWishList.filter(item => wishList.indexOf(item) === -1))
      const combineShoppingCart = shoppingCart.concat(
        userShoppingCart
        .filter(item => !shoppingCartItems.includes(item))
        .map(newItem => ({ item: newItem, amount: 1 }))
      )
      setOutletContext({
        wishList: combinedWishList,
        shoppingCart: combineShoppingCart,
      })

      // updating user with new wishlist and shopping cart
      const updateUserResponse = await axios.patch(
        "http://localhost:3000/auth/login/update",
        {
          wishList: combinedWishList,
          shoppingCart: combineShoppingCart,
        },
        {
          params: {userId: user.id}
        }
      )
      user = updateUserResponse.data
      dispatch(setIsAuth(user))
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    loginUser(formData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          name="email"
        />
        <input
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          name="password"
        />
        <button type="submit">Login</button>
      </form>
      <div>
        <div>Don't have an account?</div>
        <NavLink
          to={"/register"}
          className={({ isActive, isPending }) =>
            isActive ? "active" : isPending ? "pending" : "text-white mr-4"
          }
        >
          <button>Register here</button>
        </NavLink>
        <br />
      </div>
    </>
  );
};

export default Login;