const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const { createProductValidators, updateProductValidators } = require('../utils/productValidation');

const router = express.Router();

// Apply Auth Protect middleware to all product routes
router.use(authMiddleware.protect);

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get paginated list of products for authenticated user
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 20
 *         description: Items per page (max 20)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter by title or UPC barcode
 *       - in: query
 *         name: expiryWindow
 *         schema:
 *           type: string
 *           enum: [1m, 3m, 6m]
 *         description: Filter products expiring within 1, 3, or 6 months
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           default: active
 *         description: Product status filter (active, consumed, expired, discarded, all)
 *     responses:
 *       200:
 *         description: List of products returned successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', productController.getProducts);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get single product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product returned successfully
 *       404:
 *         description: Product not found
 */
router.get('/:id', productController.getProductById);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a new product entry
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - expiryDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: Milk 1L
 *               upcCode:
 *                 type: string
 *                 example: "012345678905"
 *               quantity:
 *                 type: number
 *                 example: 2
 *               unit:
 *                 type: string
 *                 example: pcs
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-15"
 *               category:
 *                 type: string
 *                 example: Dairy
 *               notes:
 *                 type: string
 *                 example: Store in fridge
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', createProductValidators, productController.createProduct);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               quantity:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, consumed, expired, discarded]
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put('/:id', updateProductValidators, productController.updateProduct);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', productController.deleteProduct);

module.exports = router;
