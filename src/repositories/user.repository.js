import pool from "../config/db.js";

const USER_PUBLIC_FIELDS = `
    id,
    name,
    email,
    image,
    created_at,
    updated_at
`;

const USER_LOGIN_FIELDS = `
    id,
    name,
    email,
    pass_hash,
    image
`;

export const findUserByEmail = async (email) => {
    const [result] = await pool.execute(
        `
        SELECT ${USER_LOGIN_FIELDS} FROM users 
        WHERE email = ?
        `,
        [email]
    );

    return result[0] || null;
}

export const createUser = async (name, email, pass_hash, image = null) => {
    const [result] = await pool.execute(
        `
        INSERT INTO users (
            name,
            email,
            pass_hash,
            image
        )
        VALUES (?, ?, ?, ?)
        `,
        [name, email, pass_hash, image]
    );

    return {
        id: result.insertId,
        name: name,
        email: email,
        image: image,
        created_at: new Date(),
        updated_at: new Date()
    }
}

export const findById = async (id) => {
    const [result] = await pool.execute(
        `
        SELECT ${USER_PUBLIC_FIELDS} FROM users 
        WHERE id = ?
        `,
        [id]
    );

    return result[0] || null;
}