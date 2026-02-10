const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', orderController.createOrder); // Anyone can create a quotation log
router.get('/admin/history', protect, orderController.getOrders); // Only admin can see history

module.exports = router;
