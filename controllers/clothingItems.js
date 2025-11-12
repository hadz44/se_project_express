const ClothingItem = require('../models/clothingItem');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const {
  ForbiddenError,
  InternalServerError,
  createErrorFromMongoose,
} = require('../errors/errors');

// GET /items - return all items from the database
const getClothingItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    res.status(HTTP_STATUS.OK).send(items);
  } catch (err) {
    next(new InternalServerError());
  }
};

// POST /items - create an item with name, imageUrl, and weather
const createClothingItem = async (req, res, next) => {
  try {
    const { name, imageUrl, weather } = req.body;
    const owner = req.user._id;

    const item = await ClothingItem.create({ name, imageUrl, weather, owner });
    res.status(HTTP_STATUS.CREATED).send(item);
  } catch (err) {
    next(createErrorFromMongoose(err));
  }
};

// DELETE /items/:id - delete an item by _id
const deleteClothingItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const item = await ClothingItem.findById(id).orFail();
    if (item.owner.toString() !== userId) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN_ACCESS);
    }
    await ClothingItem.findByIdAndDelete(id);
    res.status(HTTP_STATUS.OK).send({ message: ERROR_MESSAGES.CLOTHING_ITEM_DELETED });
  } catch (err) {
    if (err instanceof ForbiddenError) {
      next(err);
    } else {
      next(createErrorFromMongoose(err));
    }
  }
};

// PUT /items/:id/likes - like an item
const likeClothingItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const item = await ClothingItem.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true },
    ).orFail();
    res.status(HTTP_STATUS.OK).send(item);
  } catch (err) {
    next(createErrorFromMongoose(err));
  }
};

// DELETE /items/:id/likes - unlike an item
const unlikeClothingItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const item = await ClothingItem.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true },
    ).orFail();
    res.status(HTTP_STATUS.OK).send(item);
  } catch (err) {
    next(createErrorFromMongoose(err));
  }
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
