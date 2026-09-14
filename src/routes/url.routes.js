import express from "express";
import { createUrl, deleteUrl } from "../controllers/url.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post('/create-url', verifyJWT, createUrl);
router.post("/delete-url", verifyJWT, deleteUrl);

export default router;