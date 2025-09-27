import express from "express";
import {
  getAllMemes,
  getMemeById,
  addMeme,
  updateMemeById,
  deleteMemeById,
} from "../controllers/memeControllers.js";

// create our router to hold all memes routes
const router = express.Router();

// ****************** ROUTES ******************

// route to get all memes
router.get("/", getAllMemes);

// route to get a meme by id
router.get("/:id", getMemeById);

// route add a meme
router.post("/", addMeme);

// route to update a meme by id
router.put("/:id", updateMemeById);

// route to delete a meme by id
router.delete("/:id", deleteMemeById);

export default router;
