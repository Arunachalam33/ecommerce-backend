import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

try {
  const result = await pool.query("SELECT NOW()");
  console.log("Connected successfully:", result.rows);
} catch (err) {
  console.error("Connection failed:", err);
}

export default pool;





