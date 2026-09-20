import { createUser as createUserService, findUser } from "../services/user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import config from "../config/index.js";
import { updateRefreshToken, findUserByIdWithRefreshToken } from "../repositories/user.repository.js";

const cookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
};

export const createUserProfile = asyncHandler(async (req, res) => {
    const { name, email, password, image = null } = req.body || {};

    const missingFields = ['name', 'email', 'password'].filter(field => !(req.body || {})[field]);
    if (missingFields.length > 0) {
        throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    const existingUser = await findUser(email);
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }
    
    const pass_hash = await bcrypt.hash(password, 10);
    const result = await createUserService(name, email, pass_hash, image);
    
    return res.status(201).json({
        message: "User created successfully",
        user: {
            id: result.id,
            name: result.name,
            email: result.email,
            image: result.image
        }
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await findUser(email);
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.pass_hash);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await updateRefreshToken(user.id, refreshToken);

    delete user.pass_hash;
    delete user.refresh_token;

    return res
        .status(200)
        .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }) // 15 mins
        .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }) // 7 days
        .json({
            message: "Login successful",
            accessToken,
            user
        });
});

export const logoutUser = asyncHandler(async (req, res) => {
    await updateRefreshToken(req.user.id, null);

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json({
            message: "Logout successful"
        });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, config.jwt.refreshTokenSecret);
        
        const user = await findUserByIdWithRefreshToken(decodedToken.id);

        // checking if user exist or not and refresh token is same as in database
        if (!user || user.refresh_token !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const accessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        await updateRefreshToken(user.id, newRefreshToken);

        delete user.refresh_token;

        return res
            .status(200)
            .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
            .cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({
                message: "Access token refreshed",
                accessToken,
                user
            });

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});