import express from "express";
import router from "./routes/memeRoutes.js";
import authRouter from "./routes/authRoutes.js";
import dotenv from "dotenv";
import {
  limiter,
  checkApiKey,
  logging,
  notFoundError,
  generalError,
} from "./middleware/middleware.js";

import expressJSDocSwagger from "express-jsdoc-swagger";

dotenv.config();

const app = express();
const port = process.env.PORT;

expressJSDocSwagger(app)({
  info: {
    version: "1.0.0",
    title: "Meme API",
    description: "Docs for Meme API",
  },
  swaggerUIPath: "/docs",
  baseDir: process.cwd(), // returns the current working directory
  filesPattern: "./src/routes/**/*.{js,ts}",
  exposeApiDocs: true,
  apiDocsPath: "/api-docs.json",
});
// ****************** MIDDLEWARE ******************
// middleware to parse JSON bodies
app.use(express.json());

// middleware for logging
app.use(logging);

// Apply the rate limiting middleware to all requests.
app.use(limiter);

// Apply API key security to all requests
app.use(checkApiKey);
// Api docs

// ****************** ROUTES ******************
// root route
app.get("/", (request, response) => {
  response.send("Welcome to the dev meme API");
});

// memes routes
app.use("/memes", router);

// auth routes
app.use("/auth", authRouter);

// ****************** ERROR HANDLING ******************
// // 404 error handler
app.use(notFoundError);

// general error handler
app.use(generalError);

app.listen(port, () => {
  console.log(`Dev Meme API listening on http://localhost:${port}`);
});
