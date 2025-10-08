import express from "express";
import {
  getAllMemes,
  getMemeById,
  addMeme,
  updateMemeById,
  deleteMemeById,
} from "../controllers/memeControllers.js";
import jwt from "jsonwebtoken";

// create our router to hold all memes routes
const router = express.Router();

// middleware to authenticate users
const authenticate = (request, response, next) => {
  const authHeader = request.headers.authorization;

  const token = authHeader.split(" ")[1];

  // verify a token symmetric
  jwt.verify(token, "secret", function (err, decoded) {
    if (err)
      response.status(401).json({ error: "invalid credentials. JWT missing" });

    // add user information from JWT
    request.user = decoded; // create user property in request object

    next();
  });
};

// ****************** ROUTES ******************

// route to get all memes
router.get("/", getAllMemes);

// route to get a meme by id
router.get("/:id", getMemeById);

// *** protected routes ***
// route add a meme
router.post("/", authenticate, addMeme);

// route to update a meme by id
router.put("/:id", updateMemeById);

// route to delete a meme by id
router.delete("/:id", deleteMemeById);

export default router;
