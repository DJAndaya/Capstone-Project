// const db = require("./server/db");
// const { Items } = require("./server/db/models");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const faker = require("faker");

// console.log(faker.commerce.price());

const seed = async () => {
  try {
    // await db.sync({ force: true });

    let products = [];

    for (let i = 0; i < 100; i++) {
      const productName = faker.commerce.productName();

      let newProduct = {
        data: {
          name: productName,
          price: faker.commerce.price(),
          amount: Math.floor(Math.random() * 101),
          description: faker.commerce.productDescription(),
          category: faker.commerce.product(),
        },
      };

      products.push(newProduct);
    }

    for (const product of products) {
      await prisma.items.create(product);
      // console.log("hi");
    }

    // console.log(products);
  } catch (err) {
    console.log(err);
  }
};

seed();