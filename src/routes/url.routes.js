import express from "express";
import { createUrl } from "../controllers/url.controller.js";


const router = express.Router();

router.post('/create-url', createUrl);

export default router;