const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { validateSignup, validateSignin } = require('../middlewares/validators');
const NotFoundError = require('../errors/NotFoundError');

// Authentication routes (public)
router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);

// Mount feature routers
router.use('/users', require('./users'));
router.use('/items', require('./clothingItems'));

// 404 handler - must be last
router.use('*', (req, res, next) => next(new NotFoundError('Route not found')));

module.exports = router;
