import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import Root from './routes/root'
import ErrorPage from './routes/ErrorPage'

import Home from './components/Home'
import Cart from './components/Cart'
import Orders from './components/Orders'

export default function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          path: "/results/:search",
          element: <Home />
        },
        {
          path: "/user/orders",
          element: <Orders />
        },
        {
          path: "/user/cart",
          element: <Cart />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/register",
          element: <Register />
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}