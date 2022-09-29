const Card = require('../models/card');

const { REQUEST_OK, CREATE_OK } = require('../errors/errors');

const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const ServerError = require('../errors/serverError');
const forbiddenError = require('../errors/forbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((cards) => res.status(CREATE_OK).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании карточки'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  return Card.findById(id)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(id).then(() => res.status(REQUEST_OK).send(card)).catch(next);
      } else {
        // eslint-disable-next-line new-cap
        next(new forbiddenError('Отказано в доступе'));
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка с указанным _id не найдена'));
    }
    return res.send(card);
  })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.kind === 'ObjectId')) {
        return next(new ValidationError('Переданы некорректные данные для постановки лайка'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка с указанным _id не найдена'));
    }
    return res.send(card);
  })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.kind === 'ObjectId')) {
        return next(new ValidationError('Переданы некорректные данные для постановки лайка'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
