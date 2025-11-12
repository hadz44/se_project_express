const router = require('express').Router();
const auth = require('../middlewares/auth');
const { updateUser, getCurrentUser } = require('../controllers/users');
const { validateUserUpdate } = require('../middlewares/validators');

// Note: createUser and login routes moved to main router as /signup and /signin

// Protected routes (authentication required)
// GET /users/me - get current user profile
router.get('/me', auth, getCurrentUser);

// PATCH /users/me - update user profile
router.patch('/me', auth, validateUserUpdate, updateUser);

module.exports = router;
