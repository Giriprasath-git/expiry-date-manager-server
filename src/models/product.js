const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'Other',
      trim: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    expiryDate: {
      type: Date,
      required: true
    },
    barcode: {
      type: String,
      default: '',
      trim: true
    },
    notes: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
