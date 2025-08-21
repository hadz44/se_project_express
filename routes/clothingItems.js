const router = require('express').Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require('../controllers/clothingItems');

// GET /items - return all items from the database
router.get('/', getClothingItems);

// POST /items - create an item with name, imageUrl, and weather
router.post('/', createClothingItem);

// DELETE /items/:id - delete an item by _id
router.delete('/:id', deleteClothingItem);

// PUT /items/:id/likes - like an item
router.put('/:id/likes', likeClothingItem);

// DELETE /items/:id/likes - unlike an item
router.delete('/:id/likes', unlikeClothingItem);

module.exports = router;
