import React from "react";
// redux
import { useSelector } from "react-redux";
// router
import { useOutletContext } from "react-router-dom";
// components
import { Button } from "@mui/material";

const AddToWishListButton = ({ item }) => {
  const userId = useSelector((state) => state.isAuth?.value?.id);

  const [outletContext, setOutletContext] = useOutletContext();
  const wishList = outletContext.wishList
  let isItemInWishList = wishList.some(
    (wishListItem) => wishListItem.id === item.id
  );

  const addRemoveFromWishList = () => {
    if (isItemInWishList) {
      const updatedWishList = wishList.filter((wishListItem) => {
        return wishListItem.id !== item.id;
      });
      setOutletContext({
        ...outletContext,
        wishList: updatedWishList
      })
      // setWishList(updatedWishList);
    } else {
      setOutletContext({
        ...outletContext,
        wishList: [...outletContext.wishList, item]
      })
      // setWishList([...wishList, item]);
    }
  };

  return (
    <>
      {!isItemInWishList ? (
        <Button variant="contained" onClick={addRemoveFromWishList}>
          Add to wishlist
        </Button>
      ) : (
        <Button
          variant="contained"
          color="error"
          onClick={addRemoveFromWishList}
        >
          Remove from wishlist
        </Button>
      )}
    </>
  );
};

export default AddToWishListButton;