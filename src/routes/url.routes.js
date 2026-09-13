import express from "express";
import { createUrl, deleteUrl } from "../controllers/url.controller.js";


const router = express.Router();

router.post('/create-url', createUrl);
router.post("/delete-url", deleteUrl);

export default router;