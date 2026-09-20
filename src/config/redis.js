import { createClient } from "redis";
import config from "./index.js";

const redisClient = createClient({
    url: config.redisUrl
});

redisClient.on("error", (error) => {
    console.error("Redis connection error:", error);
});

redisClient.on("connect", () => {
    console.log("Connected to Redis successfully");
});

export default redisClient;
