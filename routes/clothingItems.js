const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  validateClothingItemCreation,
  validateMongoId,
  validateClothingItemsFilter
} = require('../middlewares/validation');
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require('../controllers/clothingItems');

// GET /items - return all items from the database (public)
router.get('/', validateClothingItemsFilter, getClothingItems);

// Protected routes (authorization required)
router.post('/', auth, validateClothingItemCreation, createClothingItem);
router.delete('/:id', auth, validateMongoId, deleteClothingItem);
router.put('/:id/likes', auth, validateMongoId, likeClothingItem);
router.delete('/:id/likes', auth, validateMongoId, unlikeClothingItem);

module.exports = router;
