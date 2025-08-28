// HTTP Status Codes
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

// Error Messages
const ERROR_MESSAGES = {
  DEFAULT_SERVER_ERROR: "An error has occurred on the server.",
  USER_NOT_FOUND: "User not found",
  INVALID_USER_ID: "Invalid user ID format",
  CLOTHING_ITEM_NOT_FOUND: "Clothing item not found",
  INVALID_ITEM_ID: "Invalid item ID format",
  CLOTHING_ITEM_DELETED: "Clothing item deleted successfully",
  ROUTE_NOT_FOUND: "Route not found",
  INVALID_URL: "You must enter a valid URL",
  INVALID_EMAIL: "Please enter a valid email address",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_ALREADY_EXISTS: "A user with this email already exists",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters long",
  AUTHORIZATION_REQUIRED: "Authorization required",
  FORBIDDEN_ACCESS: "You are not authorized to delete this item",
  INVALID_CREDENTIALS: "Incorrect email or password",
};

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
};
