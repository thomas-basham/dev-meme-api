import { registerUser, userLogin } from "../controllers/authControllers.js";
import express from "express";

const authRouter = express.Router();
// auth routes
// register a user
authRouter.post("/register", registerUser);

// login a user
authRouter.post("/login", userLogin);

export default authRouter;
