const app = require("express").Router();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_SENDER_EMAIL,
    pass: process.env.MAIL_SENDER_PASSWORD
  },
});

// registering users
app.post("/register", async (req, res, next) => {
  const { email, password, firstName, lastName, address } = req.body;
  console.log(email);
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
        confirmationToken: crypto.randomBytes(20).toString("hex"),
      },
    });

    const confirmationLink = `http://localhost:5173/confirm/${newUser.confirmationToken}`;
    const mailOptions = {
      from: process.env.MAIL_SENDER_EMAIL,
      to: email,
      subject: "Confirm Your Email",
      html: `Click <a href="${confirmationLink}">here</a> to confirm your email.`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .send("Registration successful. Check your email for confirmation.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/confirm/:token", async (req, res, next) => {
  const token = req.params.token;
  try {
    const user = await prisma.users.findUnique({
      where: { confirmationToken: token },
    });

    if (!user) {
      return res.status(404).send("Invalid confirmation token.");
    }

    await prisma.users.update({
      where: { id: user.id },
      data: {
        isConfirmed: true,
        confirmationToken: null,
      },
    });
    
    const token = jwt.sign(user, process.env.JWT_SECRET_KEY);
    res.status(200).send(token);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// login users
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const emailConfirmed = await prisma.users.findUnique({
      where: {
        email,
        isConfirmed: true
      },
    });

    if (!emailConfirmed) {
      return res.status(409).send({ message: "user does not exist" });
    }

    const isCorrectPassword = bcrypt.compareSync(
      password,
      emailConfirmed.password
    );

    if (isCorrectPassword) {
      const token = jwt.sign(emailConfirmed, process.env.JWT_SECRET_KEY);
      res.send(token);
    } else {
      res.status(401).send({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to login" });
  }
});

// send user data
app.get("/loggedin", async (req, res, next) => {
  const token = req.headers.authorization;

  const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

  res.send(user);
});

module.exports = app;
