import { useState, useEffect } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import axios from "axios";

import Root from "./routes/root";
import ErrorPage from "./routes/ErrorPage";

import Home from "./components/Home";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Admin from "./components/Admin";
import AllProducts from "./components/Admin/AllProducts";
import AllUsers from "./components/Admin/AllUsers";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Sell from "./components/Sell";
import Confirmation from "./components/Confirmation";
import CheckoutSuccess from "./components/CheckoutSuccess";
import CheckoutCancel from "./components/CheckoutCancel";
import ProductDetail from "./components/ProductDetail";

import DeletedProducts from './components/Admin/DeletedProducts';
import Wishlist
 from "./components/Wishlist";

import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from "./redux/isAuthSlice";
import socketio from "socket.io-client";

const socket = socketio("http://localhost:3000");

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectIsAuth);
  const userId = useSelector((state) => state.isAuth?.value?.id);
  // useEffect(() => {
  //   console.log("redux state after login:", user)
  //   // console.log("store after login", user.shoppingCart)
  // }, [user])

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
          path: "/user/chat",
          element: <Chat />,
        },
        {
          path: "/user/wishlist",
          element: <Wishlist />,
        },
        {
          path: "/admin",
          element: <Admin />,
        },
        // {
        //   path: "/admin/allproducts",
        //   element: <AllProducts />,
        // },
        {
          path: "/admin/deletedproducts",
          element: <DeletedProducts />,
        },
        {
          path: "/admin/allusers",
          element: <AllUsers />,
        },
        {
          path: "/product/:productId",
          element: <ProductDetail />,
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
        {
          path: "/checkout/success",
          element: <CheckoutSuccess />,
        },
        {
          path: "/checkout/cancel",
          element: <CheckoutCancel />,
        },
        {
          path: "/product/:productId",
          element: <ProductDetail />,
        },
      ],
    },
  ]);

  useEffect(() => {
    const possiblyLogin = async () => {
      const token = window.localStorage?.getItem("token");
      // console.log(token)
      if (token) {
        try {
          const userResponse = await axios.get(
            "http://localhost:3000/auth/loggedin",
            {
              headers: {
                authorization: token,
              },
            }
          );

          const user = userResponse.data;
          dispatch(setIsAuth(user));
        } catch (error) {
          console.log(error);
        }
      }
    };

    possiblyLogin();
    // if (user) {
    //   socket.emit("user_joined", user);
    //   socket.on("update_socket", (updatedUserData) => {
    //     console.log("updatedUserData:", updatedUserData); // not showing up
    //     dispatch(setIsAuth(updatedUserData));
    //     // console.log(updatedUserData);
    //     // console.log(user, "App")
    //     // console.log("user info after dispatch:", user) // not showing up
    //     socket.emit("myId", {});
    //   });
    //   console.log("user has joined with socket", user);
    //   socket.emit("myId", {});
    //   socket.on("disconnect", () => {
    //     console.log("Disconnected from server");
    //   });
    // }
  }, [userId]);

  return <RouterProvider router={router} />;
}
