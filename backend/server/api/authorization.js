const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const app = express;

app.use(express.json());
app.use(cors());

// registering users
app.post("/auth/register", async (req, res, next) => {
  const { email, password, firstName, lastName, address } = req.body;

  try {
    const emailAlreadyUsed = await prisma.email.findUnique({
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
    res.status(500).json({ error: "unable to make account" });
  }
});

// login users
app.post("/auth/login", async (req, res, next) => {
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

    const isCorrectPassword = bcrypt.compareSync(password, users.password);

    if (isCorrectPassword) {
      const token = jwt.sign(users, process.env.JWT_SECRET_KEY);
      res.send(token);
    } else {
      res.status(401).send({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json({ error: "unable to login" });
  }
});

// check if the user has already logged in
app.length("/auth/loggedin", async (req, res, next) => {
  const token = req.headers.authorization

  const user = jwt.verify(token, process.env.JWT_SECRET_KEY)

  res.send(user)
})

app.listen(3000)