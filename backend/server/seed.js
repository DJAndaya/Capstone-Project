const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const faker = require("faker");

const seed = async () => {
  try {
    const users = [];

    for (let i = 0; i < 25; i++) {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const address = faker.address.streetAddress();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      const newUser = {
        data: {
          email,
          password,
          address,
          firstName,
          lastName,
        },
      };

      const testUser = {
        data: {
          email: faker.internet.email(),
          password: "password",
          address: "address",
          firstName: "firstName",
          lastName: "lastName",
          // admin: true,
          isConfirmed: true,
        },
      };

      const createdTestUser = await prisma.users.create(testUser)
      users.push(createdTestUser)
      const createdUser = await prisma.users.create(newUser);
      users.push(createdUser);
      
    }


    for (const user of users) {
      let products = [];

      for (let i = 0; i < 5; i++) {
        const productName = faker.commerce.productName();

        let newProduct = {
          data: {
            name: productName,
            price: parseFloat(faker.commerce.price()),
            amount: Math.floor(Math.random() * 101),
            description: faker.commerce.productDescription(),
            category: faker.commerce.product(),
            seller: {
              connect: { id: user.id },
            },
          },
        };

        products.push(newProduct);
      }

      for (const product of products) {
        await prisma.items.create(product);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

seed();
