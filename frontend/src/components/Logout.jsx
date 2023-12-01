import React from "react";

import { setIsAuth } from "../redux/isAuthSlice";
import { useDispatch } from "react-redux";

import { useNavigate, useOutletContext } from "react-router-dom";

import Button from "@mui/material/Button";

import Home from "./Home";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [outletContext, setOutletContext] = useOutletContext();

  const logOut = () => {
    window.localStorage.setItem("token", null);
    dispatch(setIsAuth(null));
    setOutletContext({
      wishList: [],
      shoppingCart: [{
        item: null,
        amount: 1,
      }]
    })
    navigate("/");
  };
  return (
    <>
      <Button variant="contained" onClick={logOut}>
        Log Out
      </Button>
      <Home />
    </>
  );
};

export default Logout;
