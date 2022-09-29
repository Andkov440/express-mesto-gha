const userRoutes = require('express').Router();

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validationUserId,
  validationUpdateUser,
  validationUpdateAvatar,
} = require('../middlewares/validations');
const auth = require('../middlewares/auth');

userRoutes.use(auth);

userRoutes.get('/users', getUsers);
userRoutes.get('/users/me', getCurrentUser);

userRoutes.get('/users/:userId', validationUserId, getUser);

userRoutes.patch('/users/me', validationUpdateUser, updateUser);
userRoutes.patch('/users/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = userRoutes;
