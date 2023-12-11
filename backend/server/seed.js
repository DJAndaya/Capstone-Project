const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const faker = require("faker");
const bcrypt = require("bcrypt");
const axios = require("axios");

const getRandomImageUrl = async () => {
  try {
    const response = await axios.get("https://picsum.photos/200/300?random");
    return response.request.res.responseUrl;
  } catch (error) {
    console.log(error);
    return null;
  }
};
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

      const createdUser = await prisma.users.create(newUser);
      users.push(createdUser);
    }

    // admin user
    const adminUser = {
      data: {
        email: faker.internet.email(),
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
      const reviews = [];
      for (let i = 0; i < 5; i++) {
        const randomImageUrl = await getRandomImageUrl();

        // Create an item
        const newItem = await prisma.items.create({
          data: {
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price()),
            amount: Math.floor(Math.random() * 101),
            description: faker.commerce.productDescription(),
            category: faker.commerce.product(),
            deletedAt: null,
            seller: {
              connect: { id: user.id },
            },
          },
        });

        // Create three images for the item
        for (let j = 0; j < 3; j++) {
          const randomImageUrl = await getRandomImageUrl();
          await prisma.images.create({
            data: {
              imageUrl: randomImageUrl,
              item: {
                connect: { id: newItem.id },
              },
            },
          });
        }

        // Create 5 rewviews for the item
        for (let k = 0; k < 5; k++) {
          const randomUserId = Math.floor(Math.random() * 25) + 1; // Random user id between 1 and 25

          const review = await prisma.reviews.create({
            data: {
              dateAdded: new Date(),
              rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
              comment: faker.random.words(),
              userId: randomUserId,
              itemId: newItem.id,
            },
          });

          reviews.push(review);

          // calculating average review and updating the item
          const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const averageRating = totalRating / reviews.length;

          await prisma.items.update({
            where: { id: newItem.id },
            data: {
              averageRating: averageRating,
            },
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect(); // disconnect from Prisma client after seeding
  }
};

seed();
