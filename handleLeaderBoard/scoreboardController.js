const { PrismaClient, Gender } = require("../generated/prisma")
const prisma = new PrismaClient()

const getScoreBoard = async () => {
    const users = await prisma.user.findMany({
        select: {
          id: true,       // optional
          name: true,     // optional
          points: true,   // only include this if needed
        },
      });

      return users;
}

module.exports = {getScoreBoard}