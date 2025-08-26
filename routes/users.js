const router = require("express").Router();
const { updateUser } = require("../controllers/users");

// Note: createUser and login routes moved to main router as /signup and /signin

// PATCH /users/me - update user profile
router.patch("/me", updateUser);

module.exports = router;