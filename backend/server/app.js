const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

// Logging middleware
app.use(morgan("dev"));

app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", require("./api/authorization"));
app.use("/items", require("./api/items"));
app.use("/admin", require("./api/admin"));
app.use("/reviews", require("./api/reviews"));

app.get("/", (req, res, next) => {
  try {
    res.send("index.html");
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});
// Default to 404 if no other route matched
app.use((req, res) => {
  res.status(404).send("Not found.");
});

module.exports = app;
