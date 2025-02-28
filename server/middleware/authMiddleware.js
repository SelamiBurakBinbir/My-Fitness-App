/************************************************************
 * server/middleware/authMiddleware.js
 * JWT token kontrolü yapan ara katman (middleware).
 ************************************************************/
const jwt = require("jsonwebtoken");

// Normalde bu secret, .env dosyasından okunmalıdır.
const JWT_SECRET = "SECRET_KEY_FOR_FITNESS_APP";

function authMiddleware(req, res, next) {
  // Header'da 'Authorization' mevcut mu?
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // Bearer token formatında gelmiş olmalı
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  // Token doğrulaması
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Token geçerliyse, kullanıcı bilgilerini isteğe ekle
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
