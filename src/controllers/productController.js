const { validationResult } = require('express-validator');
const productDao = require('../dao/productDao');

const productController = {
    getProducts: async (request, response) => {
        try {
            const userId = request.user._id;

            // Extract query parameters
            let page = parseInt(request.query.page, 10) || 1;
            let limit = parseInt(request.query.limit, 10) || 20;

            // Enforce max limit of 20 as required by guidelines
            if (limit > 20) limit = 20;
            if (page < 1) page = 1;

            const search = request.query.search ? request.query.search.trim() : null;
            const expiryWindow = request.query.expiryWindow ? request.query.expiryWindow.trim() : null;
            const days = parseInt(request.query.days, 10);
            const status = request.query.status ? request.query.status.trim() : 'active';
            const sortBy = request.query.sortBy || 'expiryDate';
            const order = request.query.order === 'desc' ? -1 : 1;

            // Build Filter
            const filter = { userId };

            if (status !== 'all') {
                filter.status = status;
            }

            // Search filter by title or UPC code
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { upcCode: { $regex: search, $options: 'i' } }
                ];
            }

            // Expiry Date Range Filter
            const now = new Date();
            let targetDate = null;

            if (expiryWindow) {
                switch (expiryWindow.toLowerCase()) {
                    case '1m':
                    case '1month':
                        targetDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                        break;
                    case '3m':
                    case '3months':
                        targetDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
                        break;
                    case '6m':
                    case '6months':
                        targetDate = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
                        break;
                    default:
                        break;
                }
            } else if (!isNaN(days) && days > 0) {
                targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
            }

            if (targetDate) {
                filter.expiryDate = { $gte: now, $lte: targetDate };
            }

            const skip = (page - 1) * limit;
            const sortOptions = { [sortBy]: order };

            const [products, totalCount] = await Promise.all([
                productDao.findProducts(filter, { skip, limit, sort: sortOptions }),
                productDao.countProducts(filter)
            ]);

            const totalPages = Math.ceil(totalCount / limit) || 1;

            return response.status(200).json({
                products,
                pagination: {
                    totalCount,
                    page,
                    limit,
                    totalPages
                }
            });

        } catch (error) {
            console.error('Error in getProducts:', error);
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    getProductById: async (request, response) => {
        try {
            const { id } = request.params;
            const userId = request.user._id;

            const product = await productDao.findProductById(id, userId);
            if (!product) {
                return response.status(404).json({
                    message: 'Product not found'
                });
            }

            return response.status(200).json({
                product
            });

        } catch (error) {
            console.error('Error in getProductById:', error);
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

            const title = request.body.title || request.body.name;
            const upcCode = request.body.upcCode || request.body.barcode || null;
            const { quantity, unit, expiryDate, category, notes } = request.body;
            const userId = request.user._id;

            const productData = {
                userId,
                title,
                upcCode,
                quantity: quantity !== undefined ? Number(quantity) : 1,
                unit: unit || 'pcs',
                expiryDate: new Date(expiryDate),
                category: category || 'General',
                notes: notes || ''
            };

            const newProduct = await productDao.createProduct(productData);

            return response.status(201).json({
                message: 'Product created successfully',
                product: newProduct
            });

        } catch (error) {
            console.error('Error in createProduct:', error);
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    updateProduct: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({
                    errors: errors.array()
                });
            }

            const { id } = request.params;
            const userId = request.user._id;

            const updateData = { ...request.body };
            if (updateData.name && !updateData.title) {
                updateData.title = updateData.name;
            }
            if (updateData.barcode && !updateData.upcCode) {
                updateData.upcCode = updateData.barcode;
            }
            if (updateData.expiryDate) {
                updateData.expiryDate = new Date(updateData.expiryDate);
            }

            const updatedProduct = await productDao.updateProduct(id, userId, updateData);
            if (!updatedProduct) {
                return response.status(404).json({
                    message: 'Product not found'
                });
            }

            return response.status(200).json({
                message: 'Product updated successfully',
                product: updatedProduct
            });

        } catch (error) {
            console.error('Error in updateProduct:', error);
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    deleteProduct: async (request, response) => {
        try {
            const { id } = request.params;
            const userId = request.user._id;

            const deletedProduct = await productDao.deleteProduct(id, userId);
            if (!deletedProduct) {
                return response.status(404).json({
                    message: 'Product not found'
                });
            }

            return response.status(200).json({
                message: 'Product deleted successfully',
                product: deletedProduct
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
