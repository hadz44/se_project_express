const { celebrate, Joi, Segments } = require('celebrate');

const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{2,63}\b([-/a-zA-Z0-9()@:%_+.~#?&=]*)/;

const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    avatar: Joi.string().pattern(urlRegex).required(),
  }),
});

const validateUserUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().pattern(urlRegex).required(),
  }),
});

const validateIdParam = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const validateCreateClothingItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid('hot', 'warm', 'cold').required(),
    imageUrl: Joi.string().pattern(urlRegex).required(),
  }),
});

const validateClothingItemCreation = validateCreateClothingItem;

const validateMongoId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const validateClothingItemsFilter = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    weather: Joi.string().valid('hot', 'warm', 'cold').optional(),
    owner: Joi.string().hex().length(24).optional(),
  }),
});

module.exports = {
  validateSignin,
  validateSignup,
  validateUserUpdate,
  validateIdParam,
  validateCreateClothingItem,
  validateClothingItemCreation,
  validateMongoId,
  validateClothingItemsFilter,
};
