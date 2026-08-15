const { validationResult } = require('express-validator');
const productDao = require('../dao/productDao');

const productController = {
  getProducts: async (request, response) => {
    try {
      const userId = request.user._id;
      const products = await productDao.getProductsByUserId(userId);
      return response.status(200).json({
        message: 'Products fetched successfully',
        products
      });
    } catch (error) {
      console.error('Error in getProducts:', error);
      return response.status(500).json({
        message: 'Internal server error'
      });
    }
  },

  createProduct: async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array()
        });
      }

      const userId = request.user._id;
      const { name, category, quantity, expiryDate, barcode, notes } = request.body;

      const newProduct = await productDao.createProduct({
        userId,
        name,
        category: category || 'Other',
        quantity: quantity ? parseInt(quantity, 10) : 1,
        expiryDate,
        barcode: barcode || '',
        notes: notes || ''
      });

      return response.status(201).json({
        message: 'Product added successfully',
        product: newProduct
      });
    } catch (error) {
      console.error('Error in createProduct:', error);
      return response.status(500).json({
        message: 'Internal server error'
      });
    }
  },

  deleteProduct: async (request, response) => {
    try {
      const userId = request.user._id;
      const { id } = request.params;

      const deletedProduct = await productDao.deleteProduct(id, userId);
      if (!deletedProduct) {
        return response.status(404).json({
          message: 'Product not found or unauthorized'
        });
      }

      return response.status(200).json({
        message: 'Product removed successfully',
        productId: id
      });
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      return response.status(500).json({
        message: 'Internal server error'
      });
    }
  }
};

module.exports = productController;
