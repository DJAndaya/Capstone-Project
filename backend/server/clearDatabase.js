const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const clearDatabase = async () => {
  try {
    await prisma.reviews.deleteMany();
    await prisma.users.deleteMany();
    await prisma.images.deleteMany();
    await prisma.items.deleteMany();
    await prisma.orderHistory.deleteMany();
    await prisma.message.deleteMany();
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
};

clearDatabase();
