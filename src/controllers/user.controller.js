import { createUser as createUserService, findUser } from "../services/user.service.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


export const createUserProfile = asyncHandler(async (req, res) => {
    const { name, email, password, image = null } = req.body || {};

    // 1. Validate first before hitting the database
    const missingFields = ['name', 'email', 'password'].filter(field => !(req.body || {})[field]);
    if (missingFields.length > 0) {
        throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    // 2. Now it's safe to query since email is guaranteed to be a string, not undefined
    const existingUser = await findUser(email);

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }
    
    const pass_hash = await bcrypt.hash(password, 10);

    // image will be null if undefined, satisfying the SQL driver
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