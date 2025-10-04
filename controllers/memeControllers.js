import { memes } from "../model/memeData.js";
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
  const { title, url, userId } = request.body;

  if (!title || !url) {
    throw new Error("Title and url are required");
  }

  const newMeme = await prisma.meme.create({
    data: { title, url, userId },
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
