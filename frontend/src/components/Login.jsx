import React, { useState, useEffect } from "react";
import axios from "axios";

import { setIsAuth } from "../redux/isAuthSlice";
import { useDispatch, useSelector } from "react-redux";

import { NavLink, useNavigate, useOutletContext } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [outletContext, setOutletContext] = useOutletContext();
  const wishlist = outletContext.wishlist;
  const shoppingCartItems = outletContext.shoppingCart.map(
    (object) => object.item
  );
  const shoppingCart = outletContext.shoppingCart;
  const userId = useSelector((state) => state.isAuth?.value?.id);

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

      const user = userResponse.data;
      console.log("user info after login:",user)
      dispatch(setIsAuth(user));

      // putting DB wishlist and shopping cart into local respectively
      const userWishlist = user.wishlist || []
      // console.log("user's wishlist:", userWishlist)
      const userShoppingCart = user.shoppingCart || []
      // console.log("user's shoppingcart:", userShoppingCart)
      const combinedWishlist = wishlist.concat(userWishlist.filter(item => wishlist.indexOf(item) === -1))
      const combineShoppingCart = shoppingCart.concat(
        userShoppingCart
        .filter(item => !shoppingCartItems.includes(item))
        .map(newItem => ({ item: newItem, purchaseAmount: 1 }))
      )
      setOutletContext({
        wishlist: combinedWishlist,
        shoppingCart: combineShoppingCart,
      });

      // updating user with new wishlist and shopping cart
      const updateUserResponse = await axios.patch(
        "http://localhost:3000/auth/login/update",
        {
          wishlist: combinedWishlist,
          shoppingCart: combineShoppingCart,
        },
        {
          params: { userId: user.id },
        }
      );
      const updatedUser = updateUserResponse.data;
      // console.log(updatedUser)
      // console.log("before updatedUserData is put onto local")
      dispatch(setIsAuth(updatedUser));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      // console.log("before navigate in useEffect");
      // console.log(outletContext)
      navigate("/");
      // console.log("after navigate in useEffect");
    }
  }, [userId, navigate]);

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Login</h1>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
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
    </div>
  );
};

export default Login;
