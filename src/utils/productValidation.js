const { body } = require('express-validator');

const createProductValidators = [
    body().custom((value, { req }) => {
        const title = req.body.title || req.body.name;
        if (!title || typeof title !== 'string' || !title.trim()) {
            throw new Error('Product title is required');
        }
        return true;
    }),
    body('expiryDate')
        .isISO8601()
        .withMessage('A valid expiry date (ISO format) is required'),
    body('quantity')
        .optional()
        .isNumeric()
        .withMessage('Quantity must be a number'),
    body('upcCode')
        .optional()
        .trim(),
    body('barcode')
        .optional()
        .trim(),
    body('unit')
        .optional()
        .trim(),
    body('category')
        .optional()
        .trim(),
    body('notes')
        .optional()
        .trim()
];

const updateProductValidators = [
    body().custom((value, { req }) => {
        if (req.body.title !== undefined && (!req.body.title || typeof req.body.title !== 'string' || !req.body.title.trim())) {
            throw new Error('Product title cannot be empty');
        }
        if (req.body.name !== undefined && (!req.body.name || typeof req.body.name !== 'string' || !req.body.name.trim())) {
            throw new Error('Product title cannot be empty');
        }
        return true;
    }),
    body('expiryDate')
        .optional()
        .isISO8601()
        .withMessage('Expiry date must be a valid ISO date'),
    body('quantity')
        .optional()
        .isNumeric()
        .withMessage('Quantity must be a number'),
    body('status')
        .optional()
        .isIn(['active', 'consumed', 'expired', 'discarded'])
        .withMessage('Invalid status value')
];

module.exports = {
    createProductValidators,
    updateProductValidators
};
