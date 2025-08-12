// Temporary middleware with hardcoded user ID for development
const auth = (req, res, next) => {
  // Hardcoded user ID for development purposes
  req.user = {
    _id: "507f1f77bcf86cd799439011"
  };
  
  next();
};

module.exports = auth;
