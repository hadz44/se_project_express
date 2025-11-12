const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  DEFAULT_SERVER_ERROR: 'An error occurred on the server',
  AUTHORIZATION_REQUIRED: 'Authorization required',
  INVALID_CREDENTIALS: 'Incorrect email or password',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_URL: 'Invalid URL format',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_USER_ID: 'Invalid user ID',
  CLOTHING_ITEM_NOT_FOUND: 'Clothing item not found',
  INVALID_ITEM_ID: 'Invalid item ID',
  FORBIDDEN_ACCESS: 'Access forbidden',
  CLOTHING_ITEM_DELETED: 'Clothing item deleted',
};

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
  // Legacy exports for backward compatibility
  STATUS_BAD_REQUEST: HTTP_STATUS.BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  STATUS_UNAUTHORIZED: HTTP_STATUS.UNAUTHORIZED,
  STATUS_FORBIDDEN: HTTP_STATUS.FORBIDDEN,
  STATUS_NOT_FOUND: HTTP_STATUS.NOT_FOUND,
  STATUS_CONFLICT: HTTP_STATUS.CONFLICT,
};
