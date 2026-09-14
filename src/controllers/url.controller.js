import { createShorturl, getShortUrl, updateCount, deleteOriginalUrl } from "../services/url.service.js";
import config from "../config/index.js";
import { isValidUrl } from "../utils/urlValidator.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const createUrl = asyncHandler(async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        throw new ApiError(400, "Original URL is required");
    }

    if (!isValidUrl(originalUrl)) {
        throw new ApiError(400, "Invalid URL format");
    }
    
    const result = await createShorturl(originalUrl);

    return res.status(201).json({
        id: result.id,
        shortCode: result.short_code,
        shortUrl: `${config.appUrl}/${result.short_code}`,
        originalUrl: result.original_url
    });
});


export const redirectUrl = asyncHandler(async (req, res) => {
    const { shortCode } = req.params;

    if (!shortCode) {
        throw new ApiError(400, "Short code is required");
    }

    const url = await getShortUrl(shortCode);

    if (!url) {
        throw new ApiError(404, "URL not found");
    }

    await updateCount(shortCode); // update the click count

    // now if found redirect to the original url
    return res.redirect(302, url.original_url);
});


export const deleteUrl = asyncHandler(async (req, res) => {
    const { shortCode } = req.body;
    if(!shortCode){
        throw new ApiError(400, "Short code is required");
    };

    const result = await deleteOriginalUrl(shortCode);

    if (!result) {
        throw new ApiError(404, "URL not found");
    };

    return res.status(200).json({
        message : "URL deleted successfully"
    });
});