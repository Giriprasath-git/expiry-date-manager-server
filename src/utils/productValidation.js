const { body } = require('express-validator');

const createProductValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('expiryDate')
    .notEmpty()
    .isISO8601()
    .withMessage('Valid expiry date is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('category')
    .optional()
    .trim(),
  body('barcode')
    .optional()
    .trim(),
  body('notes')
    .optional()
    .trim()
];

module.exports = {
  createProductValidators
};
