const router = require("express").Router();
const { updateUser, getCurrentUser } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");

// Note: createUser and login routes moved to main router as /signup and /signin

// GET /users/me - get current user profile
router.get("/me", getCurrentUser);

// PATCH /users/me - update user profile
router.patch("/me", validateUserUpdate, updateUser);

module.exports = router;