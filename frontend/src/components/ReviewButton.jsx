import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

const ReviewButton = ({ onClick }) => {
  const [open, setOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReviewSubmit = () => {
    // TO DO
    // Logic to save the review, e.g., send it to a server
    console.log("Submitted review:", reviewText);

    // Logic to save the review to a database or perform other actions

    handleClose();
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
