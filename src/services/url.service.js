import { generateShortCode } from "../utils/shortCode.js";
import { createUrl, deleteByShortCode, findByShortCode, updateClickCount, findExistingOriginalUrl } from "../repositories/url.repository.js";

export async function createShorturl(originalUrl) {
    for (let i = 0; i < 5; i++) {
        try {
            const shortCode = generateShortCode();
            const result = await createUrl(shortCode, originalUrl);
            return result;
        } catch (error) {
            if (
                error.code === "ER_DUP_ENTRY" &&
                error.message.includes("uk_short_code")
            ) {
                continue;
            }

            // Original URL was inserted by another
            // concurrent request
            if (
                error.code === "ER_DUP_ENTRY" &&
                error.message.includes("uk_original_url")
            ) {
                return await findExistingOriginalUrl(originalUrl);
            }

            // Anything else is a real error
            throw error;
        }
    }
    
    throw new Error("Failed to generate a unique short code after 5 attempts");
}


export async function getShortUrl(shortCode) {
    return await findByShortCode(shortCode);
};

export async function updateCount(shortCode) {
    return await updateClickCount(shortCode);
}


export async function deleteOriginalUrl(shortCode) {
    return await deleteByShortCode(shortCode);
}
