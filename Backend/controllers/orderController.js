const orderService = require('../services/orderService');

const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrderDetails = async (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    try {
        const orderDetails = await orderService.getOrderDetails(orderId);
        if (!orderDetails) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(orderDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createOrder = async (req, res) => {
    try {
        const orderId = await orderService.createOrder(req.body);
        res.status(201).json(orderId);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    try {
        const success = await orderService.deleteOrder(orderId);
        if (!success) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getOrders,
    getOrderDetails,
    createOrder,
    deleteOrder
};



