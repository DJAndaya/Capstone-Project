import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";

const ReviewButton = ({ itemId }) => {
  const [open, setOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const isAuth = useSelector((state) => state.isAuth?.value);
  const userId = useSelector((state) => state.isAuth?.value?.id);

  const handleOpen = () => {
    if (isAuth) {
      setOpen(true);
    } else {
      alert("You must be logged in to write a review.");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (itemId) {
      fetchItemReviews(itemId);
    }
  }, [itemId]);

  const fetchItemReviews = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/reviews/itemReviews/${itemId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews: " + response.status);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const reviews = await response.json();
        setReviews(reviews);
      } else {
        throw new Error("Invalid response format: " + contentType);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/reviews/submitReview",
        {
          rating,
          userId,
          itemId: "111",
          comment: reviewText,
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to submit review");
      }

      const newReview = response.data;
      setReviews((prevReviews) => [...prevReviews, newReview]);
      handleClose();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Add a review
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
