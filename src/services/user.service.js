
import { createUser as createUserRepo, findUserByEmail } from "../repositories/user.repository.js";

export const findUser = async (email) => {
    try {
        const result = await findUserByEmail(email);
        return result;
    } catch (error) {
        throw error;
    }
}

export const createUser = async (name, email, pass_hash, image = null) => {
    try {
        const result = await createUserRepo(name, email, pass_hash, image);
        return result;
    } catch (error) {
        if (
            error.code === "ER_DUP_ENTRY" &&
            error.message.includes("uk_users_email")
        ) {
            throw new Error("Email already exists");
        }

        throw error;
    }
}