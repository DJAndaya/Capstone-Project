const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authenticateUser = async (req, res, next) => {
  // Replace this with your actual authentication logic
  const isAuth = await checkUserAuthentication(req);

  if (!isAuth) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.userAuthenticated = isAuth;
  next();
};

app.post("/submitReview", authenticateUser, async (req, res) => {
  try {
    const { rating, comment, userId, itemId } = req.body;

    if (!rating || !comment || !userId || !itemId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!isAuth) {
      return res.status(401).json({ error: "Unauthorized" });
    }

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

    if (reviews.length === 0) {
      return res.status(204).send();
    }
    res.json(reviews);
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
