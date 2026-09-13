
import app from "./app.js";
import config from "./config/index.js";
import "./config/db.js";

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});