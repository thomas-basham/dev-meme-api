import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllMemes = async (request, response) => {
  const dbMemes = await prisma.meme.findMany();
  response.json(dbMemes);
};

export const getMemeById = async (request, response) => {
  const { id } = request.params;

  const foundMeme = await prisma.meme.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!foundMeme) {
    throw new Error({
      error: "The meme with an id of " + id + " does not exist",
    });
  }

  response.json(foundMeme);
};

export const addMeme = async (request, response) => {
  const { title, url } = request.body;

  if (!title || !url) {
    throw new Error("Title and url are required");
  }

  const newMeme = await prisma.meme.create({
    data: { title, url, userId: request.user.userId }, // use authenticated userID
  });

  response.status(201).json(newMeme);
};

export const updateMemeById = async (request, response) => {
  const { id } = request.params;
  const { title, url } = request.body;

  // const foundMeme = memes.find((meme) => {
  //   return meme.id === parseInt(id);
  // });

  const updateMeme = await prisma.meme.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title,
      url,
    },
  });

  if (!updateMeme) {
    throw new Error(`The meme with an id of ${id} does not exist`);
  }

  response.json(updateMeme);
};

export const deleteMemeById = async (request, response) => {
  const { id } = request.params;

  const deleteMeme = await prisma.meme.delete({
    where: {
      id: parseInt(id),
    },
  });

  response.json(deleteMeme);
};

export const userLikesMeme = async (request, response) => {
  const { id } = request.params;

  // check if the user already liked the meme
  const existingLike = await prisma.userLikesMeme.findUnique({
    where: {
      userId_memeId: {
        userId: request.user.userId,
        memeId: parseInt(id),
      },
    },
  });

  if (existingLike) {
    // if the like exists, delete it to unlike
    await prisma.userLikesMeme.delete({
      where: {
        id: existingLike.id,
      },
    });

    response.json({ message: `User ${request.user.id} unliked meme ${id}` });
  } else {
    // if the like does not exist, add a row to userLikesMeme to like
    await prisma.userLikesMeme.create({
      data: {
        userId: request.user.userId,
        memeId: parseInt(id),
      },
    });
    response.json({ message: `User ${request.user.userId} liked meme ${id}` });
  }
};
