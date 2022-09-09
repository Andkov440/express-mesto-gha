const cardRoutes = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/cards', getCards);
cardRoutes.post('/cards/', createCard);
cardRoutes.delete('/cards/:id', deleteCard);

cardRoutes.put('/cards/:id/likes', likeCard);
cardRoutes.delete('/cards/:id/likes', dislikeCard);

module.exports = cardRoutes;
