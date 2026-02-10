const Product = require('../models/Product');
const Order = require('../models/Order');
const StockMovement = require('../models/StockMovement');

// Get all products (Public with filters/sorting)
exports.getProducts = async (req, res) => {
    try {
        const { category, search, sort, stockStatus, includeHidden } = req.query;
        let query = {};

        if (includeHidden !== 'true') {
            query['visibility.showProduct'] = true;
        }

        if (category) query.category = category;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (stockStatus) query['stock.status'] = stockStatus;

        let products = Product.find(query);

        if (sort === 'price_low') products = products.sort({ price: 1 });
        else if (sort === 'price_high') products = products.sort({ price: -1 });
        else if (sort === 'popular') products = products.sort({ 'clicks.total': -1 }); // Simpler popular 
        else products = products.sort({ createdAt: -1 });

        const result = await products;
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin CRUD
exports.createProduct = async (req, res, next) => {
    try {
        const productData = { ...req.body };

        // Handle images if uploaded
        if (req.files && req.files.length > 0) {
            productData.images = req.files.map(file =>
                `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            );
        }

        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Handle images if uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file =>
                `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            );
            // If images are provided in body (hidden field or JSON), we might want to merge.
            // But usually, form-upload replaces the images being managed.
            updateData.images = newImages;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Stock Operations
exports.handleGRN = async (req, res) => {
    try {
        const { productId, quantity, reason } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const previousQty = product.stock.totalQty;
        product.stock.totalQty += Number(quantity);
        await product.save();

        // Log movement
        const movement = new StockMovement({
            productId: product._id,
            productCode: product.productCode,
            productName: product.name,
            type: 'GRN',
            quantity: Number(quantity),
            previousQty: previousQty,
            newQty: product.stock.totalQty,
            reason: reason || 'Restock',
            adminId: req.user?._id
        });
        await movement.save();

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.handleReturn = async (req, res) => {
    try {
        const { productId, quantity, reason } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const previousQty = product.stock.totalQty;
        product.stock.totalQty -= Number(quantity);
        if (product.stock.totalQty < 0) product.stock.totalQty = 0;
        await product.save();

        // Log movement
        const movement = new StockMovement({
            productId: product._id,
            productCode: product.productCode,
            productName: product.name,
            type: 'RETURN',
            quantity: Number(quantity),
            previousQty: previousQty,
            newQty: product.stock.totalQty,
            reason: reason || 'Customer Return',
            adminId: req.user?._id
        });
        await movement.save();

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Toggle Visibility
exports.toggleVisibility = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.visibility.showProduct = !product.visibility.showProduct;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Clicks Tracker
exports.trackClick = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.clicks.total += 1;

        // Add daily stats
        const today = new Date().toISOString().split('T')[0];
        const dayStat = product.clicks.dailyStats.find(d => d.date === today);
        if (dayStat) {
            dayStat.count += 1;
        } else {
            product.clicks.dailyStats.push({ date: today, count: 1 });
        }

        // Keep only last 7 days
        if (product.clicks.dailyStats.length > 7) {
            product.clicks.dailyStats.shift();
        }

        await product.save();
        res.json({ message: 'Click tracked' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Stock History
exports.getStockHistory = async (req, res) => {
    try {
        const movements = await StockMovement.find().sort({ createdAt: -1 }).limit(100);
        res.json(movements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
