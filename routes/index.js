const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

// TODO: mount your feature routers
// router.use('/users', require('./users'));
// router.use('/items', require('./clothingItems'));

router.use('*', (req, res, next) => next(new NotFoundError('Route not found')));

module.exports = router;
