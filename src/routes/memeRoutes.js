import express from "express";
import {
  getAllMemes,
  getMemeById,
  addMeme,
  updateMemeById,
  deleteMemeById,
  userLikesMeme,
} from "../controllers/memeControllers.js";
import { authenticate, checkApiKey } from "../middleware/middleware.js";
import jwt from "jsonwebtoken";

// create our router to hold all memes routes
const router = express.Router();

// ****************** ROUTES ******************
/**
 * A Meme type
 * @typedef {object} Meme
 * @property {number} id - Meme id
 * @property {string} title.required - The title
 * @property {string} url.required - The url
 * @property {number} userId - The user Id foreign key relationship
 */

/**
 * GET /memes
 * @summary Returns an array of Meme objects
 * @tags Memes
 * @return {array<Meme>} 200 - success response - application/json
 */
router.get("/", getAllMemes);

// route to get a meme by id
router.get("/:id", getMemeById);

// *** protected routes ***
/**
 * POST /memes
 * @param {Meme} request.body.required - Meme info
 * @tags Memes
 * @return {Meme} 200 - meme response
 */
router.post("/", checkApiKey, authenticate, addMeme);

// route to update a meme by id
router.put("/:id", checkApiKey, authenticate, updateMemeById);

// route to delete a meme by id
router.delete("/:id", checkApiKey, authenticate, deleteMemeById);

// route to like a meme
router.post("/:id/like", checkApiKey, authenticate, userLikesMeme);

export default router;
