import { generateShortCode } from "../utils/shortCode.js";
import { createUrl, findByShortCode, updateClickCount } from "../repositories/url.repository.js";

export async function createShorturl(originalUrl) {

    const shortCode = generateShortCode();

    const result = await createUrl(shortCode, originalUrl)
    
    return result;
};


export async function getShortUrl(shortCode) {
    return await findByShortCode(shortCode);
};

export async function updateCount (shortCode){
    return await updateClickCount(shortCode);
}
