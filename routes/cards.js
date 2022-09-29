const cardRoutes = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { validationCreateCard, validationCardId } = require('../middlewares/validations');

const auth = require('../middlewares/auth');

cardRoutes.use(auth);

cardRoutes.get('/cards', getCards);
cardRoutes.post('/cards', validationCreateCard, createCard);

cardRoutes.delete('/cards/:id', validationCardId, deleteCard);

cardRoutes.put('/cards/:id/likes', validationCardId, likeCard);
cardRoutes.delete('/cards/:id/likes', validationCardId, dislikeCard);

module.exports = cardRoutes;
