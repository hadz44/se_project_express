const router = require("express").Router();
const { HTTP_STATUS } = require("../utils/constants");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

// Middleware for handling unknown routes
router.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'Route not found' });
});

module.exports = router;