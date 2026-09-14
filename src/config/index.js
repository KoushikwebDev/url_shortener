import "dotenv/config";


const config = {
    port: process.env.PORT,
    appUrl: process.env.APP_URL,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
};
export default config;