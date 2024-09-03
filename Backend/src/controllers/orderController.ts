import { Request, Response } from 'express';
import OrderService from '../services/orderService';

const orderService = new OrderService();

export class OrderController {
    public async getOrders(req: Request, res: Response): Promise<void> {
        try {
            const orders = await orderService.getOrders();
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async getOrderDetails(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            res.status(400).json({ message: 'Invalid order ID' });
            return;
        }

        try {
            const orderId = parseInt(id);
            const orderDetails = await orderService.getOrderDetails(orderId);

            if (!orderDetails) {
                res.status(404).json({ message: 'Order not found' });
            } else {
                res.json(orderDetails);
            }
        } catch (error) {
            console.error(`Error fetching order details for order ID ${id}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async createOrder(req: Request, res: Response): Promise<void> {
        const { client_name, order_date, total_cost, labor_cost, total_time, ETADelivery, parts } = req.body;

        if (!client_name || !Array.isArray(parts) || parts.length === 0) {
            res.status(400).json({ message: 'Invalid order data' });
            return;
        }
        // Could it be an interface?
        const orderData = {
            client_name,
            order_date,
            total_cost,
            labor_cost,
            total_time,
            ETADelivery,
            parts
        };

        try {
            const result = await orderService.createOrder(orderData);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async deleteOrder(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            res.status(400).json({ message: 'Invalid order ID' });
            return;
        }

        try {
            const orderId = parseInt(id);
            await orderService.deleteOrder(orderId);
            res.status(204).send(); // No content, might be a good idea to return some message, json or html
        } catch (error) {
            console.error(`Error deleting order ID ${id}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
