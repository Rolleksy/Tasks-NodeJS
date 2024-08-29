const request = require('supertest');
const app = require('../server');
const sqlite3 = require('sqlite3');
let db;

beforeAll(() => {
  db = new sqlite3.Database(':memory:');
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("CREATE TABLE Orders (id INTEGER PRIMARY KEY, client_name TEXT, order_date TEXT, total_cost REAL, labor_cost REAL, total_time REAL, ETADelivery TEXT)", (err) => {
        if (err) reject(err);
      });
      db.run("CREATE TABLE OrderParts (order_id INTEGER, part_id INTEGER, quantity INTEGER, FOREIGN KEY(order_id) REFERENCES Orders(id))", (err) => {
        if (err) reject(err);
      });
      db.run("CREATE TABLE Parts (id INTEGER PRIMARY KEY, price REAL, work_hours REAL, availability INTEGER, warehouse_id INTEGER)", (err) => {
        if (err) reject(err);
      });
      db.run("CREATE TABLE Warehouse (id INTEGER PRIMARY KEY, delivery_time INTEGER)", (err) => {
        if (err) reject(err);
      });
      resolve();
    });
  });
});

beforeEach(() => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM Orders', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
});

afterAll(() => {
  return new Promise((resolve) => {
    db.close(() => resolve());
  });
});

describe('Order Controller', () => {
  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          client_name: 'John Doe',
          parts: [
            { part_id: 1, quantity: 2 }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('order_id');
    });
  });

  describe('GET /api/orders/:id', () => {
    let createdOrderId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          client_name: 'John Doe',
          parts: [
            { part_id: 1, quantity: 2 }
          ]
        });
      createdOrderId = response.body.order_id;
    });

    it('should retrieve the order details', async () => {
      const response = await request(app)
        .get(`/api/orders/${createdOrderId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdOrderId);
      expect(response.body).toHaveProperty('client_name', 'John Doe');
    });

    it('should return 404 if order does not exist', async () => {
      const invalidOrderId = createdOrderId + 1;
      const response = await request(app)
        .get(`/api/orders/${invalidOrderId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/orders/:id', () => {
    let createdOrderId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          client_name: 'John Doe',
          parts: [
            { part_id: 1, quantity: 2 }
          ]
        });
      createdOrderId = response.body.order_id;
    });

    it('should delete the order', async () => {
      const response = await request(app)
        .delete(`/api/orders/${createdOrderId}`);

      expect(response.status).toBe(204);

      const checkResponse = await request(app)
        .get(`/api/orders/${createdOrderId}`);
      expect(checkResponse.status).toBe(404);
    });
  });
});
