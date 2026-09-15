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
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
        refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
    }
};
export default config;