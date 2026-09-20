
import app from "./app.js";
import config from "./config/index.js";
import "./config/db.js";
import redisClient from "./config/redis.js";

const PORT = config.port || 3000;

// Connect to Redis, then start the server
await redisClient.connect();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});