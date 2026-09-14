import express from "express";
import { createUserProfile } from "../controllers/user.controller.js";


const userRouter = express.Router();

userRouter.post("/create-user", createUserProfile);

export default userRouter;