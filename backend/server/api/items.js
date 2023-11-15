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
    next(error)
  }
})

// put item into user's shopping cart

module.exports = app