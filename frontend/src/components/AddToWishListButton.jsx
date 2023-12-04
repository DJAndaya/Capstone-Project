import React from "react";
import axios from "axios";
// redux
import { useSelector } from "react-redux";
// router
import { useOutletContext } from "react-router-dom";
// components
import { Button } from "@mui/material";

const AddToWishlistButton = ({ item }) => {
  const userId = useSelector((state) => state.isAuth?.value?.id);

  const [outletContext, setOutletContext] = useOutletContext();
  const wishlist = outletContext.wishlist
  let isItemInWishlist = wishlist.some(
    (wishlistItem) => wishlistItem.id === item.id
  );

  const addRemoveFromWishlist = async () => {
    if (isItemInWishlist) {
      const updatedWishlist = wishlist.filter((wishlistItem) => {
        return wishlistItem.id !== item.id;
      });
      setOutletContext({
        ...outletContext,
        wishList: updatedWishlist
      })
      // setWishlist(updatedWishlist);
    } else {
      setOutletContext({
        ...outletContext,
        wishlist: [...outletContext.wishlist, item]
      })
      // setWishlist([...wishlist, item]);
    }
    if (userId) {
      try {
        await axios.patch(
          'http://localhost:3000/items/addOrRemoveFromWishlist',
          { item, userId },
        );
      } catch (error) {
        console.log(error)
        // Handle errors as needed
      }
    }
  };

  return (
    <>
      {!isItemInWishlist ? (
        <Button variant="contained" onClick={addRemoveFromWishlist}>
          Add to wishlist
        </Button>
      ) : (
        <Button
          variant="contained"
          color="error"
          onClick={addRemoveFromWishlist}
        >
          Remove from wishlist
        </Button>
      )}
    </>
  );
};

export default AddToWishlistButton;