import pool from "../config/db.js";


export const findUserByEmail = async (email) => {
    const [result] = await pool.execute(
        `
        SELECT * FROM users 
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
        created_at: result.created_at,
        updated_at: result.updated_at
    }
}