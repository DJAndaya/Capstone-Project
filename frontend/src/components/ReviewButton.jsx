import React, { useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";

const fetchItemReviews = async (itemId) => {
  try {
    const response = await fetch(`/api/reviews/itemReviews/${itemId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    const reviews = await response.json();
    console.log("Item reviews:", reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

const ReviewButton = ({ itemId }) => {
  const [open, setOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const userId = useSelector((state) => state.isAuth?.value?.id);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await fetch("/api/reviews/submitReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment: reviewText,
          userId, // still to be figured out how to fetch
          itemId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      console.log("Review submitted successfully");
      handleClose();
    } catch (error) {
      console.error("Error submitting review:", error);
    }

    const handleOpen = () => {
      setOpen(true);
      fetchItemReviews(itemId);
    };
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        See / Add Reviews
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <TextField
            label="Your Review"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <Rating
            name="rating"
            value={rating}
            precision={1}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReviewSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewButton;
