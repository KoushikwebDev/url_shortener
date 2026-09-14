import pool from "../config/db.js";


export const findExistingOriginalUrl = async (originalUrl) => {
    
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
        WHERE original_url = ?
        `,
        [originalUrl]
    );

    return rows.length > 0 ? rows[0] : null;
}

export async function createUrl(shortCode, originalUrl) {

    const existingUrl = await findExistingOriginalUrl(originalUrl);

    if (existingUrl) {
        return existingUrl;
    };

    const [result] = await pool.execute(
        `
        INSERT INTO urls (
        short_code,
        original_url
        )
        VALUES (?, ?)
        `,
        [shortCode, originalUrl]
    );

    return {
        id: result.insertId,
        short_code: shortCode,
        original_url: originalUrl
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
export const deleteByShortCode = async (shortCode) => {
    const [ result ] = await pool.execute(
        `
        DELETE FROM urls
        WHERE short_code = ?
        `,
        [shortCode]
    );

    return result.affectedRows > 0;
}