import { PrismaClient } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import type { Meme } from "../types/index.js";

const prisma = new PrismaClient();

import { memeSchema } from "../utils/validation.js";

export const getAllMemes = async (
  request: Request,
  response: Response
): Promise<void> => {
  const dbMemes = await prisma.meme.findMany();
  response.json(dbMemes);
};

export const getMemeById = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;

  const foundMeme = await prisma.meme.findUnique({
    where: {
      id: parseInt(id as string),
    },
  });

  if (!foundMeme) {
    throw new Error("The meme with an id of " + id + " does not exist");
  }

  response.json(foundMeme);
};

export const addMeme = async (request: Request, response: Response) => {
  const { title, url } = request.body;

  const { error } = memeSchema.validate(request.body);
  if (error) {
    throw new Error(error?.details[0]?.message);
  }

  const newMeme = await prisma.meme.create({
    data: {
      title,
      url,
      userId: parseInt(request?.user?.userId as string),
    } as Meme, // use authenticated userID
  });

  response.status(201).json(newMeme);
};

export const updateMemeById = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { title, url } = request.body;

  const { error } = memeSchema.validate(request.body);
  if (error) {
    throw new Error(error?.details[0]?.message);
  }

  const updateMeme = await prisma.meme.update({
    where: {
      id: parseInt(id as string),
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

export const deleteMemeById = async (request: Request, response: Response) => {
  const { id } = request.params;

  const deleteMeme = await prisma.meme.delete({
    where: {
      id: parseInt(id as string),
    },
  });

  response.json(deleteMeme);
};

export const userLikesMeme = async (request: Request, response: Response) => {
  const { id } = request.params;

  // check if the user already liked the meme
  const existingLike = await prisma.userLikesMeme.findUnique({
    where: {
      userId_memeId: {
        // @ts-ignore
        userId: request.user.userId,
        memeId: parseInt(id as string),
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

    response.json({
      message: `User ${parseInt(
        request?.user?.userId as string
      )} unliked meme ${id}`,
    });
  } else {
    // if the like does not exist, add a row to userLikesMeme to like
    await prisma.userLikesMeme.create({
      data: {
        userId: parseInt(request?.user?.userId as string),

        memeId: parseInt(id as string),
      },
    });
    response.json({
      message: `User ${parseInt(
        request?.user?.userId as string
      )} liked meme ${id}`,
    });
  }
};
