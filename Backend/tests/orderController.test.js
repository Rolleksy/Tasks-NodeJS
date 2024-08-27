const request = require('supertest');
const server = require('../server');
const { partsDb } = require('../database');

describe('Order Controller', () => {
  let createdOrderId;

  beforeAll(async () => {
    await new Promise((resolve, reject) => {
      partsDb.run('DELETE FROM Orders', [], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    await new Promise((resolve, reject) => {
      partsDb.run('DELETE FROM OrderParts', [], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    await new Promise((resolve, reject) => {
      partsDb.run('DELETE FROM Parts', [], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      partsDb.run(
        "INSERT INTO Parts (id, name, price, work_hours, availability) VALUES (1, 'Part A', 10.0, 2.0, 10)",
        [],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });

  beforeEach(async () => {
    const response = await request(server).post('/api/orders').send({
      client_name: 'John Doe',
      parts: [
        { part_id: 1, quantity: 2 }
      ]
    });

    createdOrderId = response.body.order_id;
  });

  it('GET /api/orders/:id should return order details for a given ID', async () => {
    const response = await request(server).get(`/api/orders/${createdOrderId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdOrderId);
    expect(response.body.client_name).toBe('John Doe');
  });

  it('DELETE /api/orders/:id should delete an order', async () => {
    const response = await request(server).delete(`/api/orders/${createdOrderId}`);
    expect(response.status).toBe(204);

    const checkResponse = await request(server).get(`/api/orders/${createdOrderId}`);
    expect(checkResponse.status).toBe(404);
  });
});
