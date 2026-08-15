const Product = require('../models/product');

const productDao = {
  createProduct: async (productData) => {
    const product = new Product(productData);
    return await product.save();
  },

  getProductsByUserId: async (userId) => {
    return await Product.find({ userId }).sort({ expiryDate: 1 });
  },

  getProductById: async (id, userId) => {
    return await Product.findOne({ _id: id, userId });
  },

  deleteProduct: async (id, userId) => {
    return await Product.findOneAndDelete({ _id: id, userId });
  }
};

module.exports = productDao;
