import express from "express";
import { createUserProfile, loginUser, logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const userRouter = express.Router();

userRouter.post("/create-user", createUserProfile);
userRouter.post("/login", loginUser);
userRouter.post("/logout", verifyJWT, logoutUser);

export default userRouter;