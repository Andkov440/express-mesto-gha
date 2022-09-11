const Card = require('../models/card');

const {
  VALIDATION_ERROR, NOT_FOUND_ERROR, SERVER_ERROR, REQUEST_OK, CREATE_OK,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((cards) => res.status(CREATE_OK).send(cards))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;

  Card.findByIdAndDelete(id).then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(REQUEST_OK).send(card);
  })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные удаляемой карточки' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(REQUEST_OK).send(card);
  })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(REQUEST_OK).send(card);
  })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
