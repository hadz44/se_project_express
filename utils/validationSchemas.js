const Joi = require('joi');
const { ERROR_MESSAGES } = require('./constants');

// Common validation patterns
const commonPatterns = {
  name: Joi.string().min(2).max(30).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must be no more than 30 characters long',
    'any.required': 'Name is required',
  }),

  email: Joi.string().email().required().messages({
    'string.email': ERROR_MESSAGES.INVALID_EMAIL,
    'any.required': ERROR_MESSAGES.EMAIL_REQUIRED,
  }),

  password: Joi.string().min(8).required().messages({
    'string.min': ERROR_MESSAGES.PASSWORD_TOO_SHORT,
    'any.required': ERROR_MESSAGES.PASSWORD_REQUIRED,
  }),

  url: Joi.string().uri().required().messages({
    'string.uri': ERROR_MESSAGES.INVALID_URL,
    'any.required': 'URL is required',
  }),

  mongoId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid ID format',
      'any.required': 'ID is required',
    }),

  weather: Joi.string().valid('hot', 'warm', 'cold').required().messages({
    'any.only': 'Weather must be one of: hot, warm, cold',
    'any.required': 'Weather is required',
  }),
};

// User validation schemas
const userSchemas = {
  // POST /signup - Create user
  createUser: Joi.object({
    name: commonPatterns.name,
    email: commonPatterns.email,
    password: commonPatterns.password,
    avatar: commonPatterns.url,
  }),

  // POST /signin - Login user
  login: Joi.object({
    email: commonPatterns.email,
    password: commonPatterns.password,
  }),

  // PATCH /users/me - Update user
  updateUser: Joi.object({
    name: commonPatterns.name.optional(),
    avatar: commonPatterns.url.optional(),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided for update',
    }),
};

// Clothing item validation schemas
const clothingItemSchemas = {
  // POST /items - Create clothing item
  createClothingItem: Joi.object({
    name: commonPatterns.name,
    imageUrl: commonPatterns.url,
    weather: commonPatterns.weather,
  }),

  // PUT /items/:id/likes - Like clothing item
  likeClothingItem: Joi.object({
    params: Joi.object({
      id: commonPatterns.mongoId,
    }),
  }),

  // DELETE /items/:id/likes - Unlike clothing item
  unlikeClothingItem: Joi.object({
    params: Joi.object({
      id: commonPatterns.mongoId,
    }),
  }),

  // DELETE /items/:id - Delete clothing item
  deleteClothingItem: Joi.object({
    params: Joi.object({
      id: commonPatterns.mongoId,
    }),
  }),
};

// Query parameter validation schemas
const querySchemas = {
  // For future pagination, filtering, etc.
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),

  // For clothing items filtering
  clothingItemsFilter: Joi.object({
    weather: commonPatterns.weather.optional(),
    owner: commonPatterns.mongoId.optional(),
  }),
};

// Header validation schemas
const headerSchemas = {
  // Authorization header for protected routes
  authorization: Joi.object({
    authorization: Joi.string()
      .pattern(/^Bearer\s+.+$/)
      .required()
      .messages({
        'string.pattern.base': ERROR_MESSAGES.AUTHORIZATION_REQUIRED,
        'any.required': ERROR_MESSAGES.AUTHORIZATION_REQUIRED,
      }),
  }),
};

// Export all schemas
module.exports = {
  commonPatterns,
  userSchemas,
  clothingItemSchemas,
  querySchemas,
  headerSchemas,

  // Convenience functions for common validations
  validateUser: (data) => userSchemas.createUser.validate(data),
  validateLogin: (data) => userSchemas.login.validate(data),
  validateUserUpdate: (data) => userSchemas.updateUser.validate(data),
  validateClothingItem: (data) => clothingItemSchemas.createClothingItem.validate(data),
  validateMongoId: (id) => commonPatterns.mongoId.validate(id),
  validateWeather: (weather) => commonPatterns.weather.validate(weather),
};
