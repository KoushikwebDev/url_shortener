import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

// Global limit: 10 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    handler: (req, res, next) => {
        next(new ApiError(429, "Too many requests from this IP, please try again after 15 minutes"));
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Auth limit: 5 requests per 15 minutes per IP
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req, res, next) => {
        next(new ApiError(429, "Too many login/registration attempts from this IP, please try again after 15 minutes"));
    },
    standardHeaders: true,
    legacyHeaders: false,
});
