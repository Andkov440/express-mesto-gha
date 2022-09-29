const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const NotFoundError = require('../errors/notFoundError');

router.use(userRoutes);
router.use(cardRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
