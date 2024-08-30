const orderService = require('../services/orderService');
const { partsDb } = require('../database');

jest.mock('../database', () => ({
  partsDb: {
    all: jest.fn(),
    run: jest.fn(),
    serialize: jest.fn(),
    get: jest.fn()
  }
}));

describe('orderService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrders', () => {
    it('should return a list of orders', async () => {
      const mockOrders = [
        { id: 1, client_name: 'John Doe', order_date: '2024-01-01', total_cost: 100.00, labor_cost: 50.00, total_time: 10, ETADelivery: '2024-01-05' }
      ];
      
      partsDb.all.mockImplementation((query, params, callback) => {
        callback(null, mockOrders);
      });

      const orders = await orderService.getOrders();
      
      expect(orders).toHaveLength(1);
      expect(orders[0]).toHaveProperty('Client', 'John Doe');
      expect(partsDb.all).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      partsDb.all.mockImplementation((query, params, callback) => {
        callback(new Error('Database error'), null);
      });

      await expect(orderService.getOrders()).rejects.toThrow('Database error');
    });
  });

  describe('getOrderDetails', () => {
    it('should return order details', async () => {
      const mockOrderDetails = [
        { order_id: 1, client_name: 'John Doe', order_date: '2024-01-01', total_cost: 100.00, labor_cost: 50.00, total_time: 10, part_id: 1, part_name: 'Part A', quantity: 2, price: 10.00, work_hours: 1 }
      ];
      
      partsDb.all.mockImplementation((query, params, callback) => {
        callback(null, mockOrderDetails);
      });

      const orderDetails = await orderService.getOrderDetails(1);

      expect(orderDetails).toHaveProperty('id', 1);
      expect(orderDetails).toHaveProperty('client_name', 'John Doe');
      expect(partsDb.all).toHaveBeenCalledTimes(1);
    });

    it('should return null if order not found', async () => {
      partsDb.all.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      const orderDetails = await orderService.getOrderDetails(1);
      
      expect(orderDetails).toBeNull();
    });

    it('should handle errors', async () => {
      partsDb.all.mockImplementation((query, params, callback) => {
        callback(new Error('Database error'), null);
      });

      await expect(orderService.getOrderDetails(1)).rejects.toThrow('Database error');
    });
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const mockParts = [
        { part_id: 1, price: 10.00, work_hours: 1, availability: 10, delivery_time: 0 }
      ];

      partsDb.all.mockImplementation((query, params, callback) => {
        callback(null, mockParts);
      });

      partsDb.run.mockImplementation((query, params, callback) => {
        callback(null);
      });

      partsDb.serialize.mockImplementation(callback => callback());

      const orderData = {
        client_name: 'John Doe',
        parts: [{ part_id: 1, quantity: 2 }]
      };

      const result = await orderService.createOrder(orderData);

      expect(result).toHaveProperty('order_id');
      expect(partsDb.run).toHaveBeenCalled();
      expect(partsDb.all).toHaveBeenCalled();
    });

    it('should throw error if parts array is missing or empty', async () => {
      await expect(orderService.createOrder({ client_name: 'John Doe' })).rejects.toThrow('Parts array is missing or empty');
    });

    it('should handle errors', async () => {
      partsDb.all.mockImplementation((query, params, callback) => {
        callback(new Error('Database error'), null);
      });

      const orderData = {
        client_name: 'John Doe',
        parts: [{ part_id: 1, quantity: 2 }]
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow('Database error');
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order and update parts availability', async () => {
      partsDb.all.mockImplementation((query, params, callback) => {
        callback(null, [{ part_id: 1, quantity: 2 }]);
      });

      partsDb.get.mockImplementation((query, params, callback) => {
        callback(null, { availability: 8 });
      });

      partsDb.run.mockImplementation((query, params, callback) => {
        callback(null);
      });

      const result = await orderService.deleteOrder(1);

      expect(result).toBe(true);
      expect(partsDb.run).toHaveBeenCalled();
    });

    it('should return false if order not found', async () => {
      partsDb.all.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      const result = await orderService.deleteOrder(1);

      expect(result).toBe(false);
    });

    it('should handle errors', async () => {
      partsDb.all.mockImplementation((query, params, callback) => {
        callback(new Error('Database error'), null);
      });

      await expect(orderService.deleteOrder(1)).rejects.toThrow('Database error');
    });
  });
});
