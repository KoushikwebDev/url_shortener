import express from "express";
import cors from "cors";
import helmet from "helmet";

import urlRoutes from "./routes/url.routes.js";
import { redirectUrl } from "./controllers/url.controller.js";

const app = express();

app.use(helmet()); // Helmet helps to secure our application by setting various HTTP headers.

app.use(cors()); // CORS (Cross-Origin Resource Sharing) is a mechanism that allows different web applications to interact with each other.

app.use(express.json()); // express.json() is a middleware that parses incoming requests with JSON payloads.

app.use("/api/v1/urls", urlRoutes);

app.get("/health", (_, res) => {
  return res.status(200).json({
    status: "ok",
    message: "Healthy"
  });
});

app.get('/:shortCode', redirectUrl);

export default app;