import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        config.jwt.accessTokenSecret,
        { expiresIn: config.jwt.accessTokenExpiry }
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        config.jwt.refreshTokenSecret,
        { expiresIn: config.jwt.refreshTokenExpiry }
    );
};
