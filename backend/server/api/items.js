const app = require("express").Router();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

// get all items data
app.get("/", async (req, res, next) => {
  console.log("get items endpoint occured")
  try {
    res.send(
      await prisma.items.findMany({
        include: {
          // Include the user information, including socketId
          seller: {
            select: {
              id: true,
              // socketId: true,
              firstName: true,
              lastName: true,
            },
          },
          images: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      })
    );
    console.log("res.send complete")
  } catch (error) {
    // console.log(error);
  }
});

// get searched items
app.get("/search", async (req, res, next) => {
  const { searchQuery } = req.query;
  // console.log(searchQuery);
  try {
    const filteredItems = await prisma.items.findMany({
      where: {
        name: {
          startsWith: searchQuery,
          mode: "insensitive",
        },
      },
      include: {
        // Include the user information, including socketId
        seller: {
          select: {
            id: true,
            socketId: true,
            firstName: true,
            lastName: true,
          },
        },
        images: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });
    res.send(filteredItems);
  } catch (error) {
    // console.log(error);
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
        sellingItems: {
          include: {
            images: true
          }
        },
      },
    });
    res.send(response);
  } catch (error) {
    // console.log(error);
  }
});

app.delete("/deleteItemSelling/:itemId", async (req, res, next) => {
  const { itemId } = req.params;
  const { userId } = req.query;
  // console.log(`itemID: ${itemId}, userID: ${userId}`)
  try {

    await prisma.images.deleteMany({
      where: {
        itemId: Number(itemId),
      },
    });

    const removedItem = await prisma.items.delete({
      where: {
        id: Number(itemId),
        seller: { some: { id: Number(userId) } },
      },
    });
    res.send(removedItem);
  } catch (error) {
    // console.log(error);
  }
});

app.post("/sell", async (req, res, next) => {
  try {
    const { name, price, amount, description, images } = req.body.formData;
    const { id } = req.body;
    const category = "category"
    
    // console.log(images)

    // Create a new item directly without checking for existence
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
        images: {
          create: images.map((img) => ({ imageUrl: img })),
        },
      },
    });

    const newItemWithImages = await prisma.items.findUnique({
      where: { id: newItem.id },
      include: { images: true },
    });

    // console.log(newItem)
    res.send(newItemWithImages);
  } catch (error) {
    // console.log(error);
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
            disconnect: {
              id: item.id,
            },
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
            connect: { id: item.id },
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
    // console.log(error);
    res.status(500).json({ error: "Error occured adding item" });
  }
});

// add user's shopping cart
app.patch("/addOrRemoveFromWishlist", async (req, res, next) => {
  try {
    // console.log(req.body)
    // console.log("endpoint is occuring")
    const { item, userId } = req.body;
    // console.log("item:", item, "userId:", userId);
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { wishlist: true },
    });

    const isItemInWishlist = user.wishlist.some(
      (cartItem) => cartItem.id === item.id
    );
    let updatedUserWishlist = "";
    // console.log(isItemInCart);
    if (isItemInWishlist) {
      // console.log("disconnecting item from wishlist")
      updatedUserWishlist = await prisma.users.update({
        where: { id: userId },
        data: {
          wishlist: {
            disconnect: { id: item.id },
          },
        },
        // include: {shoppingCart: true}
      });
      // console.log("item being removed")
    } else {
      // console.log("conecting item to wishlist")
      updatedUserWishlist = await prisma.users.update({
        where: { id: userId },
        data: {
          wishlist: {
            connect: { id: item.id },
          },
        },
        // include: {shoppingCart: true}
      });
      // console.log("item added")
    }
    // console.log(updatedUserWishlist);
    const token = jwt.sign(updatedUserWishlist, process.env.JWT_SECRET_KEY);
    res.send(token);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Error occured adding item" });
  }
});

// clear user's shopping cart
app.patch("/clearShoppingCart", async (req, res, next) => {
  try {
    // console.log(req.body)
    let { userId } = req.query;
    userId = parseInt(userId);
    // console.log(userId);
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
    // console.log(error);
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
    // console.log(error);
    res.status(500).json({ error: "Error occured displaying shopping cart" });
  }
});

// checkout user
app.patch("/checkOut", async (req, res, next) => {
  let { userId } = req.query;
  userId = parseInt(userId);
  // console.log(req.body)
  const itemIdAndAmount = req.body;
  // console.log("checkout request went through");
  // console.log(itemIdAndAmount);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: itemIdAndAmount.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.item.name,
        },
        unit_amount: parseInt(item.item.price) * 100,
      },
      quantity: item.purchaseAmount,
    })),
    mode: "payment",
    success_url: "http://localhost:5173/checkout/success",
    cancel_url: "http://localhost:5173/checkout/cancel",
  });

  for (const { item, purchaseAmount } of itemIdAndAmount) {
    // console.log(item);
    await prisma.orderHistory.create({
      data: {
        dateOrdered: new Date(),
        userId: userId,
        itemId: item.id,
      },
    });

    await prisma.items.update({
      where: { id: item.id },
      data: {
        amount: {
          decrement: purchaseAmount,
        },
      },
    });
  }

  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      shoppingCart: {
        disconnect: itemIdAndAmount.map((item) => ({ id: item.item.id })),
      },
      // orderHistory: {
      //   connect: itemIdAndAmount.map((item) => ({ id: item.item.id })),
      // },
    },
  });
  const token = jwt.sign(updatedUser, process.env.JWT_SECRET_KEY);
  res.json({ sessionId: session.id, token });
});

// get user's wishlist
app.get("/wishlist", async (req, res, next) => {
  try {
    let { userId } = req.query;
    userId = parseInt(userId);

    // console.log(userId)
    const userWithWishlist = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        wishlist: {
          include: {
            images: true,
            seller: {
              select: {
                id: true,
                socketId: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
    res.send(userWithWishlist.wishlist);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Error occured displaying shopping cart" });
  }
});

// gets user's order history
app.get("/orderhistory", async (req, res, next) => {
  try {
    let { userId } = req.query;
    userId = parseInt(userId);

    // console.log(userId);
    const userWithOrderHistory = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        orderHistory: {
          include: {
            item: {
              include: {
                images: true,
                seller: {
                  select: {
                    id: true,
                    socketId: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.send(userWithOrderHistory.orderHistory);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Error occured displaying shopping cart" });
  }
});

app.delete("/deleteOrderHistoryItem/:itemId", async (req, res) => {
  const orderId = parseInt(req.params.itemId, 10);
  // console.log("endpoint called")
  try {
    // Delete the order history entry directly
    const deletedOrder = await prisma.orderHistory.delete({
      where: { id: orderId },
    });

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order history entry deleted successfully" });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get stripeKey from backend
app.get("/stripeKey", (req, res) => {
  res.json({ publicKey: process.env.STRIPE_PUBLIC_KEY });
});

module.exports = app;
