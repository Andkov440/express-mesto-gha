const User = require('../models/user');

const {
  VALIDATION_ERROR, NOT_FOUND_ERROR, CAST_ERROR, REQUEST_OK, CREATE_OK,
} = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(REQUEST_OK).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные пользователя' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по  _id не найден' });
      }
      return res.status(REQUEST_OK).send(user);
    })
    .catch((err) => {
      if ((err.kind === 'ObjectId') || err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные пользователя' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATE_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по _id не найден' });
      }
      return res.status(REQUEST_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;

  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по _id не найден' });
      }
      return res.status(REQUEST_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(CAST_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
