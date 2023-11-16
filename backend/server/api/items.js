const app = require("express").Router()
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
})

// put item into user's shopping cart

module.exports = app