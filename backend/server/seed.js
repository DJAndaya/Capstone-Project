const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const faker = require("faker");
const bcrypt = require("bcrypt");

const seed = async () => {
  try {
    const users = [];

    // regular users
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

      // const testUser = {
      //   data: {
      //     email: faker.internet.email(),
      //     password: "password",
      //     address: "address",
      //     firstName: "firstName",
      //     lastName: "lastName",
      //     isConfirmed: true,
      //   },
      // };

      // const createdTestUser = await prisma.users.create(testUser);
      // users.push(createdTestUser);
      const createdUser = await prisma.users.create(newUser);
      users.push(createdUser);
    }

    // admin user
    const adminUser = {
      data: {
        email: faker.internet.email(),
        // password: bcrypt.hashSync("password1234", 10),
        password: bcrypt.hashSync(process.env.ADMIN_USER_PW, 10),
        address: faker.address.streetAddress(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        admin: true,
        isConfirmed: true,
      },
    };

    const createAdminUser = await prisma.users.create(adminUser);
    users.push(createAdminUser);

    // products for all users
    for (const user of users) {
      let products = [];

      for (let i = 0; i < 5; i++) {
        const productName = faker.commerce.productName();

        let newProduct = {
          data: {
            name: productName,
            price: faker.commerce.price(),
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
  } finally {
    await prisma.$disconnect(); // disconnect from Prisma client after seeding
  }
};

seed();
