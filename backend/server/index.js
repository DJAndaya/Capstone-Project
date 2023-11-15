require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = require("./app");
// const app = express();

app.use(cors())

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

module.exports = app;
