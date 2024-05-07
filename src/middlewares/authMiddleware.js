const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';

  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

module.exports = { verifyToken };
