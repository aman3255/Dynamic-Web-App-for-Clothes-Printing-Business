const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        designFile: {
            type: String,  // Path to uploaded design file
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        variant: {
            type: Map,
            of: String,
            default: {}
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentId: {
        type: String
    },
    orderStatus: {
        type: String,
        enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'processing'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

const OrderModel = mongoose.model('orders', OrderSchema);

module.exports = OrderModel;