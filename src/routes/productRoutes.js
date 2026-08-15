const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const { createProductValidators } = require('../utils/productValidation');

const router = express.Router();

// Apply JWT authentication middleware to all product routes
router.use(authMiddleware.protect);

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Retrieve all products for authenticated user
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       category:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       expiryDate:
 *                         type: string
 *                         format: date-time
 *                       barcode:
 *                         type: string
 *                       notes:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', productController.getProducts);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Add a new product to expiry date manager
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - expiryDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Milk 1L
 *               category:
 *                 type: string
 *                 example: Dairy
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-25T00:00:00.000Z
 *               barcode:
 *                 type: string
 *                 example: "8901234567890"
 *               notes:
 *                 type: string
 *                 example: Keep refrigerated below 4C
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', createProductValidators, productController.createProduct);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Remove a product by ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to delete
 *     responses:
 *       200:
 *         description: Product removed successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', productController.deleteProduct);

module.exports = router;
