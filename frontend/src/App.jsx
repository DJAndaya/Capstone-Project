import "./App.css";

import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

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
import Sell from "./components/Sell";
import Account from "./components/Account";

export default function App() {
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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
