const express = require('express');
const mongoose = require('mongoose');
const {
  validationCreateUser,
  validationLogin,
} = require('./middlewares/validations');
const errorHandler = require('./middlewares/errorHandler');
const { createUser, login } = require('./controllers/users');
const routes = require('./routes');
// eslint-disable-next-line import/order
const { errors } = require('celebrate');
// eslint-disable-next-line import/order
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);

app.use(routes);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
