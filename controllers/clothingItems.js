const ClothingItem = require('../models/clothingItem');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const { extractValidationMessage } = require('../utils/validationHelpers');

// GET /items - return all items from the database
const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(HTTP_STATUS.OK).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

// POST /items - create an item with name, imageUrl, and weather
const createClothingItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, imageUrl, weather, owner })
    .then((item) => res.status(HTTP_STATUS.CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        const validationMessage = extractValidationMessage(err);
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: validationMessage });
      }
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

// DELETE /items/:id - delete an item by _id
const deleteClothingItem = (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(id)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).send({ message: ERROR_MESSAGES.FORBIDDEN_ACCESS });
      }
      return ClothingItem.findByIdAndDelete(id);
    })
    .then(() => res.status(HTTP_STATUS.OK).send({ message: ERROR_MESSAGES.CLOTHING_ITEM_DELETED }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.CLOTHING_ITEM_NOT_FOUND });
      }
      if (err.name === 'CastError') {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ITEM_ID });
      }
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

// PUT /items/:id/likes - like an item
const likeClothingItem = (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(HTTP_STATUS.OK).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.CLOTHING_ITEM_NOT_FOUND });
      }
      if (err.name === 'CastError') {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ITEM_ID });
      }
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

// DELETE /items/:id/likes - unlike an item
const unlikeClothingItem = (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(HTTP_STATUS.OK).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.CLOTHING_ITEM_NOT_FOUND });
      }
      if (err.name === 'CastError') {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ITEM_ID });
      }
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.DEFAULT_SERVER_ERROR });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
