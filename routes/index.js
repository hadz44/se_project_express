const router = require("express").Router();
const { HTTP_STATUS, ERROR_MESSAGES } = require("../utils/constants");
const auth = require("../middlewares/auth");
const { 
  validateUserCreation, 
  validateUserLogin
} = require("../middlewares/validation");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");

// Public routes (no authorization required)
router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserCreation, createUser);

// Protected routes (authorization required)
router.use("/users", auth, userRouter);

// Items routes - GET is public, others require auth
router.use("/items", clothingItemsRouter);

// Middleware for handling unknown routes
router.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).send({ message: ERROR_MESSAGES.ROUTE_NOT_FOUND });
});

module.exports = router;