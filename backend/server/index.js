require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/admin", (req, res) => {
  res.send("This is the Admin backend");
});

app.get("/admin/allproducts", async (req, res) => {
  // res.send("All products will be listed here.");
  try {
    const { rows } = await pool.query("SELECT * FROM items");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching items from database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/admin/allusers", (req, res) => {
  res.send("All users will be listed here.");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

module.exports = app;
