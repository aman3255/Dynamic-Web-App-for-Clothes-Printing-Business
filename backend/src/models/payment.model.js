import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    paymentIntentId: {
        type: String,
        required: true, // From Stripe
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'inr',
      },
      
    status: {
        type: String,
        enum: ['processing', 'succeeded', 'failed', 'refunded'],
        required: true,
    },
    paymentMethod: {
        type: String, // Optional: 'card', 'paypal', etc.
    },
    paidAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
