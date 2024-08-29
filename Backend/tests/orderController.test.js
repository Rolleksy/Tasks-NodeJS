const request = require('supertest');
const sqlite3 = require('sqlite3');
const server = require('../server');
const { partsDb } = require('../database');

describe('Order Controller', () => {
  let createdOrderId;
  let partsDb;

  beforeAll(async () => {
    partsDb = new sqlite3.Database(':memory:');

    // Tworzenie tabel
    await new Promise((resolve, reject) => {
      partsDb.serialize(() => {
        partsDb.run("CREATE TABLE Parts (id INTEGER PRIMARY KEY, name TEXT, price REAL, work_hours REAL, availability INTEGER)", (err) => {
          if (err) reject(err);
        });
        partsDb.run("CREATE TABLE Orders (id INTEGER PRIMARY KEY, client_name TEXT)", (err) => {
          if (err) reject(err);
        });
        partsDb.run("CREATE TABLE OrderParts (order_id INTEGER, part_id INTEGER, quantity INTEGER, FOREIGN KEY(order_id) REFERENCES Orders(id), FOREIGN KEY(part_id) REFERENCES Parts(id))", (err) => {
          if (err) reject(err);
        });
        resolve();
      });
    });
  });

  beforeEach(async () => {
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

    const response = await request(server).post('/api/orders').send({
      client_name: 'John Doe',
      parts: [
        { part_id: 1, quantity: 2 }
      ]
    });

    createdOrderId = response.body.order_id;
  });

  afterAll(done => {
    server.close(() => {
      console.log('Server closed');
      done();
    })
    partsDb.close(done);
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
