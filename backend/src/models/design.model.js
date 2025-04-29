import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    fileUrl: {
        type: String,
        required: true, // Cloudinary URL
    },
    fileType: {
        type: String,
        enum: ['pdf', 'jpg', 'jpeg', 'png'],
        required: true,
    },
    originalFileName: {
        type: String,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.model('Design', designSchema);
