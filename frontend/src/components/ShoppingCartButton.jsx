import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Fab, Modal } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Cart from "./Cart";

const ShoppingCartButton = () => {
  const user = useSelector((state) => state.isAuth?.value);
  const [outletContext] = useOutletContext();
  const shoppingCart = outletContext.shoppingCart;

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
        onClick={handleOpen}
      >
        <ShoppingCartIcon />
        {shoppingCart.length}
      </Fab>
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          color: "black",
          display: "center",
          // alignItems: "center",
          // justifyContent: "center",
          // overflowY: "auto",
          maxHeight: "80vh",
          width: "100vw",
          position: "fixed",
          margin: "5% auto auto",
          // left: "8%",
          // marginRight: "0",
          // backgroundColor: "white",
          // opacity: 0.95,
        }}
      >
        <>
          <Cart />
        </>
      </Modal>
    </>
  );
};

export default ShoppingCartButton;
