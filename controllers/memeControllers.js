import { memes } from "../model/memeData.js";
export const getAllMemes = (request, response) => {
  response.json(memes);
};

export const getMemeById = (request, response) => {
  const { id } = request.params;

  const foundMeme = memes.find((meme) => {
    return meme.id === parseInt(id);
  });

  if (!foundMeme) {
    throw new Error({
      error: "The meme with an id of " + id + " does not exist",
    });
  }

  response.json(foundMeme);
};

export const addMeme = (request, response) => {
  const { title, url } = request.body;

  if (!title || !url) {
    throw new Error("Title and url are required");
  }

  const newMeme = { id: memes.length + 1, title, url };
  memes.push(newMeme);

  console.log(memes);

  response.status(201).json(newMeme);
};

export const updateMemeById = (request, response) => {
  const { id } = request.params;
  const { title, url } = request.body;

  const foundMeme = memes.find((meme) => {
    return meme.id === parseInt(id);
  });

  if (!foundMeme) {
    throw new Error(`The meme with an id of ${id} does not exist`);
  }

  // update the found meme
  foundMeme.title = title;
  foundMeme.url = url;

  console.log(memes);

  response.json(foundMeme);
};

export const deleteMemeById = (request, response) => {
  const { id } = request.params;

  const index = memes.findIndex((meme) => {
    return meme.id === parseInt(id);
  });

  const deletedMeme = memes.splice(index, 1);

  response.json(deletedMeme);
};
