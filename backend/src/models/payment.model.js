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
    amountPaid: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: 'inr',
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded', 'partially_refunded'],
        required: true,
        default: 'pending',
    },
    paymentMethod: {
        type: String, // 'card', 'paypal', etc.
    },
    transactionId: {
        type: String,
    },
    errorMessage: {
        type: String,
    },
    paidAt: {
        type: Date,
        default: Date.now,
    },
    // Refund related fields
    refundId: {
        type: String,
    },
    refundStatus: {
        type: String,
        enum: ['none', 'pending', 'completed', 'failed'],
        default: 'none',
    },
    refundDate: {
        type: Date,
    },
    refundTransactionId: {
        type: String,
    },
    refundAmount: {
        type: Number,
        default: 0,
    },
    refundReason: {
        type: String,
    }
}, { timestamps: true });