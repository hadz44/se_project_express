const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require('../controllers/clothingItems');

// GET /items - return all items from the database (public)
router.get('/', getClothingItems);

// Protected routes (authorization required)
router.post('/', auth, createClothingItem);
router.delete('/:id', auth, deleteClothingItem);
router.put('/:id/likes', auth, likeClothingItem);
router.delete('/:id/likes', auth, unlikeClothingItem);

module.exports = router;
