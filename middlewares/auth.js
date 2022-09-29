const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'super-secret_key');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
