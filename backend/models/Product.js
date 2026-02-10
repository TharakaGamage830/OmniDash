const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    productCode: { type: String, unique: true },

    stock: {
        totalQty: { type: Number, default: 0 },
        lowStockThreshold: { type: Number, default: 10 },
        status: {
            type: String,
            enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'],
            default: 'OUT_OF_STOCK'
        }
    },

    visibility: {
        showProduct: { type: Boolean, default: true },
        showPrice: { type: Boolean, default: true },
        showStockStatus: { type: Boolean, default: true }
    },

    clicks: {
        total: { type: Number, default: 0 },
        dailyStats: [
            {
                date: { type: String }, // YYYY-MM-DD
                count: { type: Number, default: 0 }
            }
        ]
    }
}, { timestamps: true });

// Auto-generate unique product code before saving
productSchema.pre('save', async function () {
    if (this.isNew || !this.productCode) {
        const Category = mongoose.model('Category');
        const cat = await Category.findOne({ name: this.category });
        const categoryPrefix = cat ? cat.prefix : 'GEN';
        const productPrefix = (this.name || 'PRO').substring(0, 3).toUpperCase();

        // Find the total count to generate a unique trailing number
        const count = await mongoose.model('Product').countDocuments();
        const uniqueNumber = (count + 1).toString().padStart(4, '0');

        this.productCode = `${categoryPrefix}-${productPrefix}-${uniqueNumber}`;
    }

    // Auto-update stock status
    if (this.stock.totalQty === 0) {
        this.stock.status = 'OUT_OF_STOCK';
    } else if (this.stock.totalQty <= this.stock.lowStockThreshold) {
        this.stock.status = 'LOW_STOCK';
    } else {
        this.stock.status = 'IN_STOCK';
    }
});

module.exports = mongoose.model('Product', productSchema);
