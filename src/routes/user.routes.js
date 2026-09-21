import express from "express";
import { createUserProfile, loginUser, logoutUser, refreshAccessToken, getUserProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const userRouter = express.Router();

userRouter.post("/create-user", authLimiter, createUserProfile);
userRouter.post("/login", authLimiter, loginUser);
userRouter.post("/logout", verifyJWT, logoutUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.get("/profile", verifyJWT, getUserProfile);

export default userRouter;