import React from "react";
import axios from "axios";
// redux
import { useSelector } from "react-redux";
// router
import { useOutletContext } from "react-router-dom";
// components
import { Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const AddToWishlistButton = ({ item }) => {
  const userId = useSelector((state) => state.isAuth?.value?.id);

  const [outletContext, setOutletContext] = useOutletContext();
  const wishlist = outletContext.wishlist;
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
        wishlist: updatedWishlist,
      });
      // setWishlist(updatedWishlist);
    } else {
      setOutletContext({
        ...outletContext,
        wishlist: [...outletContext.wishlist, item],
      });
      // setWishlist([...wishlist, item]);
    }
    if (userId) {
      try {
        await axios.patch(
          "http://localhost:3000/items/addOrRemoveFromWishlist",
          { item, userId }
        );
      } catch (error) {
        console.log(error);
        // Handle errors as needed
      }
    }
  };

  return (
    <>
      {!isItemInWishlist ? (
        <FavoriteBorderIcon fontSize="small" onClick={addRemoveFromWishlist} />
      ) : (
        <FavoriteIcon
          style={{ color: "#FF69B4" }}
          fontSize="small"
          onClick={addRemoveFromWishlist}
        />
      )}
    </>
  );
};

export default AddToWishlistButton;
