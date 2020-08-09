const mongoose = require('mongoose');

const reviews = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    email: String,
  },
});

module.exports = mongoose.model('Review', reviews);
