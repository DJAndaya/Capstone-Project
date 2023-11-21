import React from "react";

import { setIsAuth } from "../redux/isAuthSlice";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const logOut = () => {
    window.localStorage.setItem("token", null)
    dispatch(setIsAuth(null))
    navigate("/")
  };
  return (
    <Button variant="contained" onClick={logOut}>
      Log Out
    </Button>
  );
};

export default Logout;
