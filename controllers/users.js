const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const { JWT_SECRET } = require('../utils/config');
const {
  ValidationError,
  UnauthorizedError,
  InternalServerError,
  createErrorFromMongoose,
} = require('../errors/errors');

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(HTTP_STATUS.CREATED).send(userWithoutPassword);
  } catch (err) {
    next(createErrorFromMongoose(err));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email or password are missing
    if (!email) {
      throw new ValidationError(ERROR_MESSAGES.EMAIL_REQUIRED);
    }
    if (!password) {
      throw new ValidationError(ERROR_MESSAGES.PASSWORD_REQUIRED);
    }

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.status(HTTP_STATUS.OK).send({ token });
  } catch (err) {
    if (err.message === 'Incorrect email or password') {
      next(new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS));
    } else if (err instanceof ValidationError || err instanceof UnauthorizedError) {
      next(err);
    } else {
      next(new InternalServerError());
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true },
    ).orFail();
    res.status(HTTP_STATUS.OK).send(user);
  } catch (err) {
    next(createErrorFromMongoose(err, 'user'));
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).orFail();
    res.status(HTTP_STATUS.OK).send(user);
  } catch (err) {
    next(createErrorFromMongoose(err, 'user'));
  }
};

module.exports = { createUser, login, updateUser, getCurrentUser };
