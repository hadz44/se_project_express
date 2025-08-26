const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS.OK).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

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
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
      }
      if (err.code === 11000) {
        return res.status(HTTP_STATUS.CONFLICT).send({ message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
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

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(HTTP_STATUS.OK).send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: "Incorrect email or password" });
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
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

module.exports = { getUsers, createUser, getUser, login, updateUser };
