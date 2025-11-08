/**
 * Extracts validation error messages from Mongoose ValidationError
 * @param {Object} validationError - Mongoose ValidationError object
 * @returns {string} - Formatted validation error message
 */
const extractValidationMessage = (validationError) => {
  if (!validationError || !validationError.errors) {
    return 'Validation failed';
  }

  const errorMessages = Object.values(validationError.errors).map((err) => err.message);
  return errorMessages.join(', ');
};

module.exports = {
  extractValidationMessage,
};
