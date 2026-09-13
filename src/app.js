const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// const urlRoutes = require("./routes/url.routes");

const app = express();

app.use(helmet()); // Helmet helps to secure our application by setting various HTTP headers.
app.use(cors()); // CORS (Cross-Origin Resource Sharing) is a mechanism that allows different web applications to interact with each other.
app.use(express.json());

// app.use("/api/v1/urls", urlRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

module.exports = app;