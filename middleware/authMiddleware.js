const jwt = require('jsonwebtoken');
require('dotenv').config();

const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ status: 401, message: "No autorizado, el token es obligatorio..." });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ status: 401, message: "No autorizado, el token es inválido..." });
    }
    req.user = user;
    next(); 
  });
};

module.exports = AuthMiddleware;