import "dotenv/config";


const config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT,
    appUrl: process.env.APP_URL,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    }
};
export default config;