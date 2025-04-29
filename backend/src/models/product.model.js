import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: [
            'Polo T-Shirts', 'Packaging Labels', 'Booklets', 'Stickers', 'Cards',
            'Acrylic Prints', 'Flyers', 'Certificates', 'ID Cards', 'Tote Bags',
            'Brochures', 'Banners'
        ],
        required: true,
    },
    description: {
        type: String,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    mockupTemplateUrl: {
        type: String, // Optional URL for design preview templates
    },
    availableSizes: [String], // e.g., ['S', 'M', 'L', 'XL']
    availableColors: [String], // e.g., ['Red', 'Blue', 'Black']
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
