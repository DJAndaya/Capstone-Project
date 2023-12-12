const express = require("express");
const app = require("express").Router();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is the Admin backend");
});

app.get("/allproducts", async (req, res) => {
  try {
    const items = await prisma.items.findMany({
      
    }); // add query to filter out deleted products! (SELECT * FROM items WHERE...)
    res.json(items);
  } catch (error) {
    console.error("Error fetching items from database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/allproducts/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    const item = await prisma.items.findUnique({
      where: {
        id: productId,
      },
    });
    res.json(item);
  } catch (error) {
    console.error("Error fetching item from database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/allusers", async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users from database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/addproduct", async (req, res) => {
  const { name, price, amount, description, category, sellerId } = req.body;

  try {
    const newItem = await prisma.items.create({
      data: {
        name,
        price,
        amount,
        description,
        category,
        seller: {
          connect: { id: sellerId}
        }
      },
    });

    res.json(newItem);
  } catch (error) {
    console.error("Error adding product to the database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/editproduct/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  const { name, price, amount, description, category } = req.body;

  try {
    const updatedItem = await prisma.items.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        amount,
        description,
        category,
      },
    });

    if (!updatedItem) {
      res.status(404).send("Product not found");
    } else {
      res.json(updatedItem);
    }
  } catch (error) {
    console.error("Error updating product in the database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/deleteproduct/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);

  try {
    const updatedItem = await prisma.items.update({
      where: {
        id: productId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    if (!updatedItem) {
      res.status(404).send("Product not found");
    } else {
      res.json(updatedItem);
    }
  } catch (error) {
    console.error("Error deleting product from the database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.patch("/restoreproduct/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    const updatedItem = await prisma.items.update({
      where: {
        id: productId,
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    if (!updatedItem) {
      res.status(404).send("Product not found");
    } else {
      res.json(updatedItem);
    }
  } catch (error) {
    console.error("Error undoing delete product from the database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/deletedproducts", async (req, res) => {
  const days = Number(req.query.days);
  if (isNaN(days)) {
    return res.status(400).send("Invalid number of days");
  }
  try {
    const deletedProducts = await prisma.items.findMany({
      where: {
        isDeleted: true,
        deletedAt: {
          gte: new Date(new Date() - days * 24 * 60 * 60 * 1000),
        },
      },
    });
    res.json(deletedProducts);
  } catch (error) {
    console.error("Error fetching deleted products from database:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = app;
