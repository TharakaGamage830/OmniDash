const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.getProducts);
router.post('/:id/click', productController.trackClick);

const upload = require('../middleware/uploadMiddleware');

// Admin protected routes
router.post('/admin/add', protect, upload.array('images', 5), productController.createProduct);
router.put('/admin/update/:id', protect, upload.array('images', 5), productController.updateProduct);
router.delete('/admin/delete/:id', protect, productController.deleteProduct);
router.patch('/admin/toggle-visibility/:id', protect, productController.toggleVisibility);
router.get('/admin/stock-history', protect, productController.getStockHistory);
router.post('/admin/grn', protect, productController.handleGRN);
router.post('/admin/return', protect, productController.handleReturn);

module.exports = router;
