// import { seedData } from "../seedData.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      username: "Thomas",
      password: "pass123",
    },
  });

  await prisma.meme.create({
    data: {
      title: "AI and Calculators",
      url: "https://march25-cohort-meme-bucket.s3.us-east-1.amazonaws.com/dev+memes/ai-and-calculators.webp",
      userId: user.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
