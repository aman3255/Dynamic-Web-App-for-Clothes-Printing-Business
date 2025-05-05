const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    paymentIntentId: {
        type: String,
        required: true // From Stripe
    },
    amount: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'inr'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded', 'partially_refunded'],
        required: true,
        default: 'pending'
    },
    paymentMethod: {
        type: String // 'card', 'upi', etc.
    },
    transactionId: {
        type: String
    },
    errorMessage: {
        type: String
    },
    paidAt: {
        type: Date
    },
    // Refund related fields
    refundId: {
        type: String
    },
    refundStatus: {
        type: String,
        enum: ['none', 'pending', 'completed', 'failed'],
        default: 'none'
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundReason: {
        type: String
    }
}, { timestamps: true });

const PaymentModel = mongoose.model('payments', PaymentSchema);

module.exports = PaymentModel;