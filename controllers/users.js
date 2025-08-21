const User = require("../models/user");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../utils/constants");

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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(HTTP_STATUS.CREATED).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({ message: ERROR_MESSAGES.USER_NOT_FOUND });
      }
      return res.status(HTTP_STATUS.OK).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: ERROR_MESSAGES.INVALID_USER_ID });
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

module.exports = { getUsers, createUser, getUser };
