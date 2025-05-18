import { createPool } from "mysql2/promise";
import dotenv from "dotenv";
import { runAll } from "./parser.js";

dotenv.config();

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("MySQL connected successfully");
        connection.release();
    } catch (error) {
        console.error("MySQL connection error:", error);
        console.log("If MySQL isn't running, use docker compose up -d");
        process.exit(1);
    }
}

testConnection();
runAll();

export default pool;
