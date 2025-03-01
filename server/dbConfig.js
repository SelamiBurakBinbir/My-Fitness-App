/************************************************************
 * server/dbConfig.js
 * PostgreSQL veritabanı bağlantı ayarları.
 ************************************************************/
const { Pool } = require("pg");

// Çevre değişkenlerinden veya sabit değerlerden okunabilir.
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fitnessdb",
  password: "1001",
  port: 5432,
});

module.exports = pool;
