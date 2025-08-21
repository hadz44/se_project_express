// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
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
};

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
};
