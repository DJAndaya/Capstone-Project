import { useState, useEffect } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import axios from 'axios'

import Root from "./routes/root";
import ErrorPage from "./routes/ErrorPage";

import Home from "./components/Home";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Admin from "./components/Admin";
import AllProducts from "./components/Admin/AllProducts";
import AllUsers from "./components/Admin/AllUsers";

import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Sell from "./components/Sell"
import Confirmation from "./components/Confirmation";
import { useDispatch, useSelector } from 'react-redux'
import { setIsAuth, selectIsAuth } from './redux/isAuthSlice'

export default function App() {
  const dispatch = useDispatch()

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/results/:search",
          element: <Home />,
        },
        {
          path: "/user/orders",
          element: <Orders />,
        },
        {
          path: "/user/cart",
          element: <Cart />,
        },
        {
          path: "/user/sell",
          element: <Sell />,
        },
        {
          path: "/admin",
          element: <Admin />,
        },
        {
          path: "/admin/allproducts",
          element: <AllProducts />,
        },
        {
          path: "/admin/allusers",
          element: <AllUsers />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
        {
          path: "/confirm/:token",
          element: <Confirmation />,
        },
      ],
    },
  ]);

  useEffect(() => {
    // const possiblyLogin = async () => {
    //   const token = window.localStorage.getItem("token");
    //   console.log(token)
    //   if (token) {
    //     const userResponse = await axios.get("http://localhost:3000/auth/loggedin", {
    //       headers: {
    //         authorization: token,
    //       },
    //     });

    //     const user = userResponse.data;
    //     dispatch(setIsAuth(user));
    //   }
    // };

    // possiblyLogin();
  }, []);
  
  return <RouterProvider router={router} />;
}
