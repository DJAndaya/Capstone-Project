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
  const [hasReview, setHasReview] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [keyForRemount, setKeyForRemount] = useState(0)

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
          const dataReviews = await response.json();
          setReviews(dataReviews);
          // console.log("reviews:", reviews)
          console.log("userid:", userId)
          reviews.forEach((review) => {
            if (review.userId === userId) {
              setReviewId(review.id);
              console.log("reviewid:", reviewId)
              // Match found
              // console.log("hi");
              setHasReview(true);
              setReviewText(review.comment);
              setRating(review.rating);
              setReviewId(review.id);
            }
          });
        } else {
          throw new Error("Invalid response format: " + contentType);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (itemId) {
      fetchItemReviews(itemId);
      // console.log(reviews);
    }
  }, [keyForRemount]);

  const handleReviewSubmit = async () => {
    
    try {
      const response = await axios.post(
        "http://localhost:3000/reviews/submitReview",
        {
          rating,
          userId,
          itemId,
          comment: reviewText,
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to submit review");
      }

      const newReview = response.data;
      // console.log(newReview);
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setHasReview(true)
      setKeyForRemount((prevKeyForRemount) => prevKeyForRemount++)
      handleClose();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleReviewUpdate = async () => {
    reviews.forEach((review) => {
      if (review.userId === userId) {
        // Match found
        // console.log("hi");
        setHasReview(true);
        setReviewText(review.comment);
        setRating(review.rating);
        setReviewId(review.id);
      }
    });
    console.log(reviewId)
    try {
      const response = await axios.patch(
        `http://localhost:3000/reviews/editReview/${reviewId}`,
        {
          rating,
          comment: reviewText,
        }
      );
      setKeyForRemount((prevKeyForRemount) => prevKeyForRemount++)
      handleClose();
    } catch (error) {
      // console.log(error);
    }
  };

  const handleReviewDelete = async () => {
    reviews.forEach((review) => {
      if (review.userId === userId) {
        // Match found
        // console.log("hi");
        setHasReview(true);
        setReviewText(review.comment);
        setRating(review.rating);
        setReviewId(review.id);
      }
    });
    try {
      const response = await axios.delete(
        `http://localhost:3000/reviews/deleteReview/${reviewId}`
      );
      setHasReview(false)
      setKeyForRemount((prevKeyForRemount) => prevKeyForRemount++)
      handleClose();
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      {!hasReview ? (
        <>
          <Button variant="contained" onClick={handleOpen}>
            Add Review
          </Button>
        </>
      ) : (
        <>
          <Button variant="contained" onClick={handleOpen}>
            Update Review
          </Button>
        </>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{!hasReview ? "Add Review" : "Update Review"}</DialogTitle>
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
          <Button
            onClick={!hasReview ? handleReviewSubmit : handleReviewUpdate}
            color="primary"
          >
            {!hasReview ? "Submit" : "Update"}
          </Button>
          {!hasReview ? null : (
            <Button onClick={handleReviewDelete} color="primary">
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewButton;
