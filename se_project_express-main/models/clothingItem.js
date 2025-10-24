const mongoose = require('mongoose');
const validator = require('validator');
const { ERROR_MESSAGES } = require('../utils/constants');

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: { 
      validator(value) { 
        return validator.isURL(value); 
      }, 
      message: ERROR_MESSAGES.INVALID_URL, 
    }, 
  },
  weather: {
    type: String,
    required: true,
    enum: ['hot', 'warm', 'cold'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('clothingItem', clothingItemSchema);
