import { createShorturl, getShortUrl, updateCount } from "../services/url.service.js";
import config from "../config/index.js";

export async function createUrl(req, res) {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400)
                .json({ message: "Original URL is required" })
        }

        const result = await createShorturl(originalUrl);

        return res.status(201).json({
            id: result.id,
            shortCode: result.shortCode,
            shortUrl: `${config.appUrl}/${result.shortCode}`,
            originalUrl: result.originalUrl
        });

    } catch (error) {
        console.error("Error in createUrl:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export async function redirectUrl(req, res) {
    try {
        const { shortCode } = req.params;

        if (!shortCode) {
            return res.status(400)
                .json({ message: "Short code is required" })
        }

        const url = await getShortUrl(shortCode);

        if (!url) {
            return res.status(404)
                .json({ message: "URL not found" })
        }

        await updateCount(shortCode); // update the click count

        // now if found redirect to the original url
        return res.redirect(302, url.original_url);

    } catch (error) {
        console.error("Error in redirectUrl:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}