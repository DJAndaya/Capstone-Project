const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const clearDatabase = async () => {
  try {
    await prisma.users.deleteMany();
    await prisma.items.deleteMany();
    await prisma.reviews.deleteMany();
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
};

clearDatabase();