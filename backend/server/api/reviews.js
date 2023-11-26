const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

app.post("/submitReview", async (req, res) => {
  try {
    const { rating, comment, userId, itemId } = req.body;

    const newReview = await prisma.reviews.create({
      data: {
        rating,
        comment,
        userId,
        itemId,
      },
    });

    res.json(newReview);
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/itemReviews/:itemId", async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);

    const reviews = await prisma.reviews.findMany({
      where: {
        itemId,
      },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
