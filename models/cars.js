const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    year: { type: Number, required: true },
    type: { type: String, required: true },
    zip: { type: Number, required: true },
    mileage: { type: Number, required: true },
    image: { type: String, required: true },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      email: String,
    },
    description: String,
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  { _id: false }
);

module.exports = mongoose.model('car', carSchema);
