import pool from "../config/db.js";


export const findExistingOriginalUrl = async (originalUrl, userId) => {
    
    const [rows] = await pool.execute(
        `
        SELECT
        id,
        short_code,
        original_url,
        click_count,
        created_at,
        expires_at
        FROM urls
        WHERE original_url = ? AND user_id = ?
        `,
        [originalUrl, userId]
    );

    return rows.length > 0 ? rows[0] : null;
}

export async function createUrl(shortCode, originalUrl, userId) {

    const existingUrl = await findExistingOriginalUrl(originalUrl, userId);

    if (existingUrl) {
        return existingUrl;
    };

    const [result] = await pool.execute(
        `
        INSERT INTO urls (
        short_code,
        original_url,
        user_id
        )
        VALUES (?, ?, ?)
        `,
        [shortCode, originalUrl, userId]
    );

    return {
        id: result.insertId,
        short_code: shortCode,
        original_url: originalUrl,
        user_id: userId
    };
};

export async function findByShortCode(shortCode) {

    const [rows] = await pool.execute(
        `
        SELECT
        id,
        short_code,
        original_url,
        click_count,
        created_at,
        expires_at
        FROM urls
        WHERE short_code = ?
        `,
        [shortCode]
    );

    return rows.length > 0 ? rows[0] : null;
};


export async function updateClickCount(shortCode) {

    const [result] = await pool.execute(
        `
        UPDATE urls
        SET click_count = click_count + 1,
        updated_at = CURRENT_TIMESTAMP
        WHERE short_code = ?
        `,
        [shortCode]
    );

    return result.affectedRows > 0;
}

// delete url
export const deleteByShortCode = async (shortCode, userId) => {
    const [ result ] = await pool.execute(
        `
        DELETE FROM urls
        WHERE short_code = ? AND user_id = ?
        `,
        [shortCode, userId]
    );

    return result.affectedRows > 0;
}

export const findUrlsByUserId = async (userId) => {
    const [rows] = await pool.execute(
        `
        SELECT
        id,
        short_code,
        original_url,
        click_count,
        created_at,
        expires_at
        FROM urls
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId]
    );

    return rows;
};