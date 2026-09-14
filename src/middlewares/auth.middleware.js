import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import config from "../config/index.js";
import { findById } from "../repositories/user.repository.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, config.jwt.secret);

        const user = await findById(decodedToken.id);

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Exclude password hash from the attached user object
        const { pass_hash, ...safeUser } = user;
        req.user = safeUser;
        
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});
