const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    upcCode: {
        type: String,
        trim: true,
        default: null
    },
    quantity: {
        type: Number,
        default: 1,
        min: 0
    },
    unit: {
        type: String,
        trim: true,
        default: 'pcs'
    },
    expiryDate: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        trim: true,
        default: 'General'
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'consumed', 'expired', 'discarded'],
        default: 'active'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual aliases for frontend compatibility (name -> title, barcode -> upcCode)
productSchema.virtual('name').get(function () {
    return this.title;
});

productSchema.virtual('barcode').get(function () {
    return this.upcCode;
});

// Compound indexes for optimal queries
productSchema.index({ userId: 1, expiryDate: 1, status: 1 });
productSchema.index({ userId: 1, upcCode: 1 });

module.exports = mongoose.model('Product', productSchema);
