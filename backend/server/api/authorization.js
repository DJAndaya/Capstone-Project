const app = require("express").Router()
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// registering users
app.post("/register", async (req, res, next) => {
  const { email, password, firstName, lastName, address } = req.body;
  console.log(email)
  try {
    const emailAlreadyUsed = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (emailAlreadyUsed) {
      return res.status(409).send({ message: "Email already used" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        address,
      },
    });

    const token = jwt.sign(newUser, process.env.JWT_SECRET_KEY);
    res.send(token);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "unable to make account" });
  }
});

// login users
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const emailAlreadyUsed = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!emailAlreadyUsed) {
      return res.status(409).send({ message: "user does not exist" });
    }

    const isCorrectPassword = bcrypt.compareSync(password, emailAlreadyUsed.password);

    if (isCorrectPassword) {
      const token = jwt.sign(emailAlreadyUsed, process.env.JWT_SECRET_KEY);
      res.send(token);
    } else {
      res.status(401).send({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "unable to login" });
  }
});

// send user data 
app.get("/loggedin", async (req, res, next) => {
  const token = req.headers.authorization

  const user = jwt.verify(token, process.env.JWT_SECRET_KEY)

  res.send(user)
})

module.exports = app