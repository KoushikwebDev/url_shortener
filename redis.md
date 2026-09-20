# Redis & Docker Configuration

This document explains how our Node.js application connects to Redis running inside a Docker container, and how to manage the container.

## 1. Starting Redis with Docker
To spin up a Redis instance, we use the following command:

```bash
docker run --name url-shortener-redis \
  -p 6379:6379 \
  -d redis
```

### How this works:
* **`--name url-shortener-redis`**: Assigns a human-readable name to the container so it's easy to find and manage later.
* **`-d redis`**: Tells Docker to download the official Redis image and run it in "detached" mode (in the background).
* **`-p 6379:6379` (The Magic Bridge)**: This creates a tunnel between your host machine (your Mac) and the isolated container.
  * The **left side** (`6379:`) is the port on your Mac (`localhost`).
  * The **right side** (`:6379`) is the port *inside* the container where the Redis server is listening.
  * *Result*: Docker listens on your Mac's port 6379 and forwards all traffic straight into the container.

## 2. Connecting Node.js to Docker
Because of the port mapping above, our Node.js app doesn't need to know anything about Docker. It just needs to look at `localhost:6379`.

In our `.env` file, we set:
```env
REDIS_URL=redis://localhost:6379
```

When our Express app starts, it sends a connection request to `localhost:6379`. Docker catches that request on the host machine and instantly tunnels it into the container, where the Redis server accepts it.

## 3. Interacting with Redis (CLI)
If you want to manually inspect the cache (like seeing what URLs are currently cached), you can jump into the container and use the `redis-cli`:

```bash
docker exec -it url-shortener-redis redis-cli
```

### Useful CLI Commands:
* `KEYS *`: Lists all keys currently in the cache (e.g., `url:abc123`)
* `GET url:abc123`: Shows the original URL stored for that short code.
* `TTL url:abc123`: Shows how many seconds are left until that key expires.
* `FLUSHALL`: Wipes the entire cache clean.
