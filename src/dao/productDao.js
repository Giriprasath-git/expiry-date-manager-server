const Product = require('../models/product');

const productDao = {
    createProduct: async (productData) => {
        const product = new Product(productData);
        const savedProduct = await product.save();
        return savedProduct;
    },

    findProducts: async (filter, options = {}) => {
        const { skip = 0, limit = 20, sort = { expiryDate: 1 } } = options;
        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
        return products;
    },

    countProducts: async (filter) => {
        const count = await Product.countDocuments(filter);
        return count;
    },

    findProductById: async (id, userId) => {
        const product = await Product.findOne({ _id: id, userId });
        return product;
    },

    updateProduct: async (id, userId, updateData) => {
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true, runValidators: true }
        );
        return updatedProduct;
    },

    deleteProduct: async (id, userId) => {
        const deletedProduct = await Product.findOneAndDelete({ _id: id, userId });
        return deletedProduct;
    }
};

module.exports = productDao;
