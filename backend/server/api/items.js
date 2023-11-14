const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const app = express;

app.use(express.json());
app.use(cors());

// get all items data
app.get("/", async (req, res, next) => {
  try{
    res.send(await prisma.items.findMany())
  } catch(error) {
    next(error)
  }
})