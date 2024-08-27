const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders
router.get('/orders', orderController.getOrders);

// Get order details by ID
router.get('/orders/:id', orderController.getOrderDetails);

// Create a new order
router.post('/orders', orderController.createOrder);

// Delete an order by ID
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
