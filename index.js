import express from "express";
import router from "./routes/memeRoutes.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = 3000;

// ****************** MIDDLEWARE ******************
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

// memes routes
app.use("/memes", router);

// user routes

// auth routes
// register a user
app.post("/auth/register", async (request, response, next) => {
  const { username, password } = request.body;

  // use bcrypt to hash our password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create a user object in our db with the hashed pw
  const user = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });

  // respond with the created user
  response.status(201).json(user);
});

// login a user
app.post("/auth/login", async (request, response) => {
  const { username, password } = request.body;

  // get our user from the db
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  // if the user doesn't exist, send a 401 error response
  if (!user) {
    return response.status(401).json({ error: "Username does not exist" });
  }

  // check if plain text password matches the hashed pw in db
  const validPassword = await bcrypt.compare(password, user.password);

  // if password is incorrect, send a 401 error response
  if (!validPassword) {
    return response.status(401).json({ error: "Wrong password, buddy" });
  }

  // if all is good, create our JWT
  const token = jwt.sign(
    {
      userId: user.id,
      role: "regular", // we'll use the role later when we implement that feature
    },
    "secret",
    { expiresIn: "1h" }
  );

  // respond with the JWT
  response.json({ token });
});

// // 404 error handler
app.use((request, response, next) => {
  response.status(404).json({
    error: "We could not find the url you are looking for",
    message: `route ${request.originalUrl} not found`,
  });
});

// ****************** ERROR HANDLING ******************
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
