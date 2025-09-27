import express from "express";
import router from "./routes/memeRoutes.js";
const app = express();
const port = 3000;

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
