const request = require('supertest');
const express = require('express');
const orderController = require('../controllers/orderController');
const orderService = require('../services/orderService');

jest.mock('../services/orderService');

const app = express();
app.use(express.json());
app.get('/orders', orderController.getOrders);
app.get('/orders/:id', orderController.getOrderDetails);
app.post('/orders', orderController.createOrder);
app.delete('/orders/:id', orderController.deleteOrder);

describe('orderController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /orders', () => {
    it('should return a list of orders', async () => {
      orderService.getOrders.mockResolvedValue([
        { id: 1, Client: 'John Doe', Date: '2024-01-01', Total_Cost: '$100.00', Labor_Cost: '$50.00', Parts_Cost: '$50.00', Total_Time: '10 hours', ETA_Delivery: '2024-01-05' }
      ]);

      const response = await request(app).get('/orders');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(orderService.getOrders).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      orderService.getOrders.mockRejectedValue(new Error('Service error'));

      const response = await request(app).get('/orders');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Service error');
    });
  });

  describe('GET /orders/:id', () => {
    it('should return order details', async () => {
      orderService.getOrderDetails.mockResolvedValue({ id: 1, client_name: 'John Doe', order_date: '2024-01-01', total_cost: 100.00 });

      const response = await request(app).get('/orders/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(orderService.getOrderDetails).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if order not found', async () => {
      orderService.getOrderDetails.mockResolvedValue(null);

      const response = await request(app).get('/orders/1');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Order not found');
    });

    it('should handle errors', async () => {
      orderService.getOrderDetails.mockRejectedValue(new Error('Service error'));

      const response = await request(app).get('/orders/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Service error');
    });
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      orderService.createOrder.mockResolvedValue({ order_id: 1 });

      const response = await request(app).post('/orders').send({ client_name: 'John Doe', parts: [{ part_id: 1, quantity: 2 }] });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('order_id');
      expect(orderService.createOrder).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      orderService.createOrder.mockRejectedValue(new Error('Service error'));

      const response = await request(app).post('/orders').send({ client_name: 'John Doe', parts: [{ part_id: 1, quantity: 2 }] });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Service error');
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should delete an order', async () => {
      orderService.deleteOrder.mockResolvedValue(true);

      const response = await request(app).delete('/orders/1');

      expect(response.status).toBe(204);
      expect(orderService.deleteOrder).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if order not found', async () => {
      orderService.deleteOrder.mockResolvedValue(false);

      const response = await request(app).delete('/orders/1');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Order not found');
    });

    it('should handle errors', async () => {
      orderService.deleteOrder.mockRejectedValue(new Error('Service error'));

      const response = await request(app).delete('/orders/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Service error');
    });
  });
});
