const express = require("express");
const app = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("This is the Review backend");
});

app.get("/itemReviews/:itemId", async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  console.log("Received request for item:", itemId); // Added this line
  try {
    const reviews = await prisma.reviews.findMany({
      where: {
        itemId: itemId,
      },
    });
    console.log("Fetched reviews:", reviews); // Added this line
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/submitReview", async (req, res) => {
  try {
    const { rating, comment, userId, itemId } = req.body;

    const parsedUserId = parseInt(userId);
    const parsedItemId = parseInt(itemId);

    if (!rating || !comment || !parsedUserId || !parsedItemId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newReview = await prisma.reviews.create({
      data: {
        dateAdded: new Date(),
        rating,
        userId: parsedUserId,
        itemId: parsedItemId,
        comment,
      },
    });

    res.json(newReview);
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/editReview/:reviewId", async (req, res) => {
  const reviewId = parseInt(req.params.reviewId);
  const { rating, comment } = req.body;
  try {
    const updatedReview = await prisma.reviews.update({
      where: {
        id: reviewId,
      },
      data: {
        rating,
        comment,
      },
    });
    res.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/deleteReview/:reviewId", async (req, res) => {
  const reviewId = parseInt(req.params.reviewId);
  try {
    const deletedReview = await prisma.reviews.delete({
      where: {
        id: reviewId,
      },
    });
    res.json(deletedReview);
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
