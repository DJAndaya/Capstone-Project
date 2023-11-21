// const app = require("express").Router();
// const cors = require("cors");
// const { PrismaClient } = require("@prisma/client");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const prisma = new PrismaClient();

// app.get("/admin", (req, res) => {
//   res.send("This is the Admin backend");
// });

// app.get("/admin/allproducts", async (req, res) => {
//   try {
//     const { rows } = await pool.query("SELECT * FROM items");
//     res.json(rows);
//   } catch (error) {
//     console.error("Error fetching items from database:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/admin/allusers", async (req, res) => {
//   // res.send("All users will be listed here.");
//   try {
//     const { rows } = await pool.query("SELECT * FROM users");
//     res.json(rows);
//   } catch (error) {
//     console.error("Error fetching items from database:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/admin/addproduct", async (req, res) => {
//   const { name, price, amount, description, category } = req.body;

//   try {
//     const { rows } = await pool.query(
//       "INSERT INTO items (name, price, amount, description, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//       [name, price, amount, description, category]
//     );

//     res.json(rows[0]);
//   } catch (error) {
//     console.error("Error adding product to the database:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.put("/admin/editproduct/:productId", async (req, res) => {
//   const productId = req.params.productId;
//   const { name, price, amount, description, category } = req.body;

//   try {
//     const { rows } = await pool.query(
//       "UPDATE items SET name = $1, price = $2, amount = $3, description = $4, category = $5 WHERE id = $6 RETURNING *",
//       [name, price, amount, description, category, productId]
//     );

//     if (rows.length === 0) {
//       res.status(404).send("Product not found");
//     } else {
//       res.json(rows[0]);
//     }
//   } catch (error) {
//     console.error("Error updating product in the database:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.delete("/admin/deleteproduct/:productId", async (req, res) => {
//   const productId = req.params.productId;

//   try {
//     const { rows } = await pool.query(
//       "DELETE FROM items WHERE id = $1 RETURNING *",
//       [productId]
//     );

//     if (rows.length === 0) {
//       res.status(404).send("Product not found");
//     } else {
//       res.json(rows[0]);
//     }
//   } catch (error) {
//     console.error("Error deleting product from the database:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}...`);
// });

// module.exports = app;
