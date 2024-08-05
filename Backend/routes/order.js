const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getOrderDetails);
router.post('/orders', orderController.createOrder);
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
