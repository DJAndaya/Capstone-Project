const app = require("express").Router();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// get all items data
app.get("/", async (req, res, next) => {
  try{
    res.send(await prisma.items.findMany())
  } catch(error) {
    console.log(error)
  }
})

app.post("/sell", async (req, res, next) => {
  try {
    const { name, price, amount, description, category } = req.body.formData
    const { id } = req.body
    
    const newItem = await prisma.items.create({
      data: {
        name,
        price: Number(price),
        amount: Number(amount),
        description,
        category,
        seller: {
          connect: { id: id }
        }
      }
    })
  } catch (error) {
    console.log(error)
  }
});

//
app.get("/id", async (req, res, next) => {
  const itemId = req.body;
  try {
    res.send(await prisma.items.findUnique({
      where: {
        id: itemId
      }
    }));
  } catch (error) {
    retrurn.status(500).json({ error: "error finding item"})
  }
});

// add user's shopping cart
app.patch("/addShoppingCart", async (req, res, next) => {
  try {
    console.log(req.body)
    const { itemId, userId } = req.body;  

    const updatedUserShoppingCart = await prisma.users.update({
      where: { id: userId },
      data: {
        shoppingCart: {
          connect: itemId,
        },
      },
    });

    const token = jwt.sign(updatedUserShoppingCart, process.env.JWT_SECRET_KEY);
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error occured adding item" });
  }
});

module.exports = app;