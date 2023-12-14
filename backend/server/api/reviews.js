const express = require("express");
const app = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const updateItemAverageRating = async (itemId) => {
  const reviews = await prisma.reviews.findMany({
    where: {
      itemId: itemId,
    },
  });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  await prisma.items.update({
    where: { id: itemId },
    data: {
      averageRating: averageRating,
    },
  });
};

app.get("/", (req, res) => {
  res.send("This is the Review backend");
});

app.get("/itemReviews/:itemId", async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  // console.log("Received request for item:", itemId); // Added this line
  try {
    const reviews = await prisma.reviews.findMany({
      where: {
        itemId: itemId,
      },
    });
    // console.log("Fetched reviews:", reviews); // Added this line
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/submitReview", async (req, res) => {
  try {
    const { rating, comment, userId, itemId } = req.body;
    // console.log(req.body)

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
    // console.log(newReview)
    await updateItemAverageRating(parsedItemId)

    res.json(newReview);
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/editReview/:reviewId", async (req, res) => {
  const reviewId = parseInt(req.params.reviewId);
  const { rating, comment } = req.body;
  console.log("reviewId", reviewId)
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

    await updateItemAverageRating(updatedReview.itemId)

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

    await updateItemAverageRating(deletedReview.itemId)

    res.json(deletedReview);
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
