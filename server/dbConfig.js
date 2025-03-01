/************************************************************
 * server/dbConfig.js
 * PostgreSQL veritabanı bağlantı ayarları.
 ************************************************************/
const { Pool } = require("pg");

const isProduction = process.env.DATABASE_URL ? true : false;

// Çevre değişkenlerinden veya sabit değerlerden okunabilir.
const config = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "fitnessdb",
  password: process.env.DB_PASSWORD || "1001",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  // Eğer production ortamındaysanız, connectionString ve ssl ayarlarını ekleyin.
  ...(isProduction && {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  }),
};

const pool = new Pool(config);

module.exports = pool;
