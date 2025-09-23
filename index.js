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

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.get("/memes", (request, response) => {
  response.json(memes);
});

app.post("/memes", (request, response) => {
  const { title, url } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "Title and url are required" });
  }

  const newMeme = { id: memes.length + 1, title, url };
  memes.push(newMeme);

  console.log(memes);

  response.status(201).json(newMeme);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
