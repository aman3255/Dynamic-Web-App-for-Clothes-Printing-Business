const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: {
        type: String, // "Classic Cotton T-Shirt" or "Premium Canvas Tote Bag".
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['tshirt', 'bag', 'award', 'bottle', 'packaging', 'photo', 'sticker', 'idcard', 'banner'],
        index: true
    },
    description: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    images: [{
        type: String, // URLs to product images in Cloudinary
        required: true
    }],
    variants: [{
        name: String, // e.g., "Size", "Color"
        options: [String] // e.g., ["S", "M", "L"] or ["Red", "Blue"]
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    printingArea: {
        width: Number, // in cm or inches
        height: Number
    },
    minOrderQuantity: {
        type: Number,
        default: 1,
        min: 1
    }
}, {
    timestamps: true
});

const ProductModel = mongoose.model('products', ProductSchema);

module.exports = ProductModel;