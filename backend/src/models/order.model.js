import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            design: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Design',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            unitPrice: {
                type: Number,
                required: true,
            },
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'failed'],
        default: 'unpaid',
    },
    orderedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
