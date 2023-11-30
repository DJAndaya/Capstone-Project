const app = require("express").Router();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// get all items data
app.get("/", async (req, res, next) => {
  try {
    res.send(
      await prisma.items.findMany({
        include: {
          // Include the user information, including socketId
          seller: {
            select: {
              id: true,
              socketId: true,
            },
          },
        },
      })
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/getItemsSelling", async (req, res, next) => {
  const { userId } = req.query;
  try {
    const response = await prisma.users.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        sellingItems: true,
      },
    });
    res.send(response);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/deleteItemSelling/:itemId", async (req, res, next) => {
  const { itemId } = req.params;
  const { userId } = req.query;

  try {
    const removedItem = await prisma.items.delete({
      where: {
        id: Number(itemId),
        seller: { some: { id: Number(userId) } },
      },
    });
    res.send(removedItem);
  } catch (error) {
    console.log(error);
  }
});

app.post("/sell", async (req, res, next) => {
  try {
    const { name, price, amount, description, category } = req.body.formData;
    const { id } = req.body;

    const newItem = await prisma.items.create({
      data: {
        name,
        price: Number(price),
        amount: Number(amount),
        description,
        category,
        seller: {
          connect: { id: id },
        },
      },
    });
    res.send(newItem);
  } catch (error) {
    console.log(error);
  }
});

app.get("/id", async (req, res, next) => {
  const itemId = req.body;
  try {
    res.send(
      await prisma.items.findUnique({
        where: {
          id: itemId,
        },
      })
    );
  } catch (error) {
    retrurn.status(500).json({ error: "error finding item" });
  }
});

// add user's shopping cart
app.patch("/addOrRemoveFromShoppingCart", async (req, res, next) => {
  try {
    // console.log(req.body)
    const { item, userId } = req.body;
    // console.log(userId);
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { shoppingCart: true },
    });

    const isItemInCart = user.shoppingCart.some(
      (cartItem) => cartItem.id === item.id
    );
    let updatedUserShoppingCart = "";
    // console.log(isItemInCart);
    if (isItemInCart) {
      updatedUserShoppingCart = await prisma.users.update({
        where: { id: userId },
        data: {
          shoppingCart: {
            disconnect: item,
          },
        },
        // include: {shoppingCart: true}
      });
      // console.log("item being removed")
    } else {
      updatedUserShoppingCart = await prisma.users.update({
        where: { id: userId },
        data: {
          shoppingCart: {
            connect: item,
          },
        },
        // include: {shoppingCart: true}
      });
      // console.log("item added")
    }
    // console.log(updatedUserShoppingCart);
    const token = jwt.sign(updatedUserShoppingCart, process.env.JWT_SECRET_KEY);
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error occured adding item" });
  }
});

// clear user's shopping cart
app.patch("/clearShoppingCart", async (req, res, next) => {
  try {
    // console.log(req.body)
    let { userId } = req.query;
    userId = parseInt(userId);
    console.log(userId);
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { shoppingCart: true },
    });

    const itemsInShoppingCart = user.shoppingCart.map((item) => ({
      id: item.id,
    }));
    // console.log(userId);
    updatedUserShoppingCart = await prisma.users.update({
      where: { id: userId },
      data: {
        shoppingCart: {
          disconnect: itemsInShoppingCart,
        },
      },
    });
    // console.log("item being removed")
    // console.log(updatedUserShoppingCart);
    const token = jwt.sign(updatedUserShoppingCart, process.env.JWT_SECRET_KEY);
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error occured adding item" });
  }
});

// get user's shopping cart
app.get("/shoppingCart", async (req, res, next) => {
  try {
    let { userId } = req.query;
    userId = parseInt(userId);

    // console.log(userId)
    const userWithShoppingCart = await prisma.users.findUnique({
      where: { id: userId },
      include: { shoppingCart: true },
    });
    res.send(userWithShoppingCart.shoppingCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error occured displaying shopping cart" });
  }
});

// checkout user
app.patch("/checkOut", async (req, res, next) => {
  let { userId } = req.query;
  userId = parseInt(userId);
  // console.log(req.body)
  const itemIdAndAmount = req.body;
  console.log("checkout request went through");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: itemIdAndAmount.map(item => ({
      price_data: {
        currency: 'usd',  
        product_data: {
          name: item.name,  
        },
        unit_amount: item.amount,
      },
      quantity: 1,
    })),
    mode: 'payment',
    success_url: 'http://localhost:5173/checkout/success', 
    cancel_url: 'http://localhost:5173/checkout/cancel', 
  });

  for (const { itemId, amount } of itemIdAndAmount) {
    console.log(itemId);
    await prisma.items.update({
      where: { id: itemId },
      data: {
        amount: {
          decrement: amount,
        },
      },
    });
  }

  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      shoppingCart: {
        disconnect: itemIdAndAmount.map((item) => ({ id: item.itemId })),
      },
      orderHistory: {
        connect: itemIdAndAmount.map((item) => ({ id: item.itemId })),
      },
    },
  });
  const token = jwt.sign(updatedUser, process.env.JWT_SECRET_KEY);
  res.json({ sessionId: session.id, token});
});

// get user's wishlist
app.get("/wishlist", async (req, res, next) => {
  try {
    let { userId } = req.query;
    userId = parseInt(userId);

    // console.log(userId)
    const userWithWishList = await prisma.users.findUnique({
      where: { id: userId },
      include: { wishList: true },
    });
    res.send(userWithWishList.wishList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error occured displaying shopping cart" });
  }
});

// gets user's order history
app.get("/orderhistory", async (req, res, next) => {
  try {
    let { userId } = req.query;
    userId = parseInt(userId);

    // console.log(userId)
    const userWithOrderHistory = await prisma.users.findUnique({
      where: { id: userId },
      include: { orderHistory: true },
    });
    res.send(userWithOrderHistory.orderHistory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error occured displaying shopping cart" });
  }
});

// get stripeKey from backend
app.get('/stripeKey', (req, res) => {
  res.json({ publicKey: process.env.STRIPE_PUBLIC_KEY });
});

module.exports = app;
