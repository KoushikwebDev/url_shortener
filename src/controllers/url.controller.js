import { createShorturl, getShortUrl, updateCount, deleteOriginalUrl } from "../services/url.service.js";
import config from "../config/index.js";
import { isValidUrl } from "../utils/urlValidator.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import redisClient from "../config/redis.js";

export const createUrl = asyncHandler(async (req, res) => {
    const { originalUrl } = req.body;
    const userId = req.user.id;

    if (!originalUrl) {
        throw new ApiError(400, "Original URL is required");
    }

    if (!isValidUrl(originalUrl)) {
        throw new ApiError(400, "Invalid URL format");
    }
    
    const result = await createShorturl(originalUrl, userId);

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

    // 1. Check Redis Cache First
    const cachedOriginalUrl = await redisClient.get(`url:${shortCode}`);
    
    if (cachedOriginalUrl) {
        // Cache Hit: redirect immediately, update count asynchronously in background
        updateCount(shortCode).catch(err => console.error("Failed to update count async", err));
        return res.redirect(302, cachedOriginalUrl);
    }

    // 2. Cache Miss: Fetch from DB
    const url = await getShortUrl(shortCode);

    if (!url) {
        throw new ApiError(404, "URL not found");
    }

    // 3. Save to Redis Cache with a 24-hour expiration (86400 seconds)
    await redisClient.setEx(`url:${shortCode}`, 86400, url.original_url);

    // 4. Update count and redirect
    await updateCount(shortCode);
    return res.redirect(302, url.original_url);
});


export const deleteUrl = asyncHandler(async (req, res) => {
    const { shortCode } = req.body;
    const userId = req.user.id;

    if(!shortCode){
        throw new ApiError(400, "Short code is required");
    };

    const result = await deleteOriginalUrl(shortCode, userId);

    if (!result) {
        throw new ApiError(404, "URL not found or you are not authorized to delete it");
    };

    // Invalidate the cache for this shortCode so it doesn't redirect to a deleted URL
    await redisClient.del(`url:${shortCode}`);

    return res.status(200).json({
        message : "URL deleted successfully"
    });
});