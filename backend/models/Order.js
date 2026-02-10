const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            productCode: String,
            name: String,
            price: Number,
            quantity: { type: Number, default: 1 }
        }
    ],
    totalAmount: { type: Number, required: true },
    whatsappMessage: { type: String },
    status: { type: String, default: 'QUOTATION' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
