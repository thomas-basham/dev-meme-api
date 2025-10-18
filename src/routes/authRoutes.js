import { registerUser, userLogin } from "../controllers/authControllers.js";
import express from "express";
import { checkApiKey } from "../middleware/middleware.js";
const authRouter = express.Router();
// auth routes
// register a user
authRouter.post("/register", checkApiKey, registerUser);

// login a user
authRouter.post("/login", checkApiKey, userLogin);

export default authRouter;
