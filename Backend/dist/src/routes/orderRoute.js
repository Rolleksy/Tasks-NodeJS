"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = __importDefault(require("../controllers/orderController"));
const router = (0, express_1.Router)();
const orderController = new orderController_1.default();
// Get all orders
router.get('/orders', orderController.getOrders);
// Get order details
router.get('/orders/:id', orderController.getOrderDetails);
// Create a new order
router.post('/orders', orderController.createOrder);
// Delete an order by ID
router.delete('/orders/:id', orderController.deleteOrder);
exports.default = router;
