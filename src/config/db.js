import mysql from "mysql2/promise";
import config from "./index.js";

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.DB_PORT,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then((connection) => {
    console.log("Connected to the MySQL database successfully!");
    connection.release();
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

export default pool;