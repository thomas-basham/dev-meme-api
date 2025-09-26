import express from "express";
const app = express();
const port = 3000;

const memes = [
  {
    id: 59,
    title: "Some Random Blog Github My Code Stackoverflow",
    url: "https://march25-cohort-meme-bucket.s3.us-east-1.amazonaws.com/dev+memes/some-random-blog-github-my-code-stackoverflow.png",
  },
  {
    id: 60,
    title: "Still Better Than Nothing",
    url: "https://march25-cohort-meme-bucket.s3.us-east-1.amazonaws.com/dev+memes/still-better-than-nothing.webp",
  },
  {
    id: 61,
    title: "Temu Legolas",
    url: "https://march25-cohort-meme-bucket.s3.us-east-1.amazonaws.com/dev+memes/temu-legolas.png",
  },
  {
    id: 62,
    title: "That Moment You Realize Where the Bug Is or Isnt",
    url: "https://march25-cohort-meme-bucket.s3.us-east-1.amazonaws.com/dev+memes/that-moment-you-realize-where-the-bug-is-or-isnt.webp",
  },
  {
    id: 63,
    title: "The Evolution of a Website From Caveman To",
    url: "https://march25-cohort-meme-bucket.s3.us-east-1.amazonaws.com/dev+memes/the-evolution-of-a-website-from-caveman-to.webp",
  },
  {
    id: 64,
    title: "The First and the Main Rule",
    url: "https://march25-cohort-meme-bucket.s3.us-east-1.amazonaws.com/dev+memes/the-first-and-the-main-rule.webp",
  },
  {
    id: 65,
    title: "The Programmers Love Algorithm a Table Mishap",
    url: "https://march25-cohort-meme-bucket.s3.us-east-1.amazonaws.com/dev+memes/the-programmers-love-algorithm-a-table-mishap.webp",
  },
];

// middleware to parse JSON bodies
app.use(express.json());

// middleware for logging
app.use((request, response, next) => {
  console.log(
    `${request.method} ${request.url} at ${new Date().toISOString()}`
  );
  next();
});

// ****************** ROUTES ******************
// root route
app.get("/", (request, response) => {
  response.send("Welcome to the dev meme API");
});

// route to get all memes
app.get("/memes", (request, response) => {
  response.json(memes);
});

// route to get a meme by id
app.get("/memes/:id", (request, response) => {
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
});

// route add a meme
app.post("/memes", (request, response) => {
  const { title, url } = request.body;

  if (!title || !url) {
    throw new Error("Title and url are required");
  }

  const newMeme = { id: memes.length + 1, title, url };
  memes.push(newMeme);

  console.log(memes);

  response.status(201).json(newMeme);
});

// route to update a meme by id
app.put("/memes/:id", (request, response) => {
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
});

// route to delete a meme by id
app.delete("/memes/:id", (request, response) => {
  const { id } = request.params;

  const index = memes.findIndex((meme) => {
    return meme.id === parseInt(id);
  });

  const deletedMeme = memes.splice(index, 1);

  response.json(deletedMeme);
});

// // 404 error handler
app.use((request, response, next) => {
  response.status(404).json({
    error: "We could not find the url you are looking for",
    message: `route ${request.originalUrl} not found`,
  });
});

// general error handler
app.use((error, request, response, next) => {
  console.log("ERROR! Something broke", error.stack);

  response.status(500).json({
    error: error.name,
    message: error.message,
  });
});

app.listen(port, () => {
  console.log(`Dev Meme API listening on port http://localhost:${port}`);
});
