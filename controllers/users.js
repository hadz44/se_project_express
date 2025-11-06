const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");
const { extractValidationMessage } = require("../utils/validationHelpers");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(HTTP_STATUS.CREATED).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        const validationMessage = extractValidationMessage(err);
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: validationMessage });
      }
      if (err.code === 11000) {
        return res.status(HTTP_STATUS.CONFLICT).send({ message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  // Check if email or password are missing
  if (!email) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: ERROR_MESSAGES.EMAIL_REQUIRED });
  }
  if (!password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: ERROR_MESSAGES.PASSWORD_REQUIRED });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(HTTP_STATUS.OK).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(HTTP_STATUS.OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(HTTP_STATUS.NOT_FOUND).send({ message: ERROR_MESSAGES.USER_NOT_FOUND });
      }
      if (err.name === "ValidationError") {
        const validationMessage = extractValidationMessage(err);
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: validationMessage });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(HTTP_STATUS.OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(HTTP_STATUS.NOT_FOUND).send({ message: ERROR_MESSAGES.USER_NOT_FOUND });
      }
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: ERROR_MESSAGES.INVALID_USER_ID });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

module.exports = { createUser, login, updateUser, getCurrentUser };
