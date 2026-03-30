const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : [],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ MySQL connecté avec Prisma - OD-Partners IA");
  } catch (error) {
    console.error("❌ Erreur de connexion à MySQL :", error);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };