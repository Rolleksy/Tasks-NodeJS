import { Router } from 'express';
import {OrderController} from '../controllers/orderController';

const router = Router();
const orderController = new OrderController();

// Get all orders
router.get('/orders', orderController.getOrders);

// Get order details
router.get('/orders/:id', orderController.getOrderDetails);

// Create a new order
router.post('/orders', orderController.createOrder);

// Delete an order by ID
router.delete('/orders/:id', orderController.deleteOrder);

export default router;
