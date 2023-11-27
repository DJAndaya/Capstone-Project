import React, { useState,  } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

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
      const response = await fetch("/api/reviews/submitReviews", {
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
          <TextField
            label="Rating"
            type="number"
            InputProps={{ inputProps: { min: 1, max: 5 } }}
            fullWidth
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
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
