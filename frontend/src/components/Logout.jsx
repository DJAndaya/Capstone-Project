import React from "react";

import { setIsAuth } from "../redux/isAuthSlice";
import { useDispatch } from "react-redux";

import { useNavigate, useOutletContext } from "react-router-dom";

import Button from "@mui/material/Button";

import Wishlist from "./Wishlist";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [outletContext, setOutletContext] = useOutletContext();

  const logOut = () => {
    window.localStorage.removeItem("token");
    dispatch(setIsAuth(null));
    setOutletContext({
      wishlist: [],
      shoppingCart: [],
    });
    navigate("/");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        marginTop: '-70px'
      }}
    >
      <Button
        variant="contained"
        onClick={logOut}
        style={{ marginBottom: "20px" }}
      >
        Log Out
      </Button>
    </div>
  );
};

export default Logout;