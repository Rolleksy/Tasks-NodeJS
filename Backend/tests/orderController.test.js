// tests/orderController.test.js

const request = require('supertest');
const app = require('../server'); // Załaduj aplikację zamiast uruchamiać serwer
const sqlite3 = require('sqlite3');

describe('Order Controller', () => {
    let createdOrderId;
    let db;

    beforeAll(async () => {
        db = new sqlite3.Database(':memory:');

        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("CREATE TABLE Parts (id INTEGER PRIMARY KEY, name TEXT, price REAL, work_hours REAL, availability INTEGER)", (err) => {
                    if (err) reject(err);
                });
                db.run("CREATE TABLE Orders (id INTEGER PRIMARY KEY, client_name TEXT)", (err) => {
                    if (err) reject(err);
                });
                db.run("CREATE TABLE OrderParts (order_id INTEGER, part_id INTEGER, quantity INTEGER, FOREIGN KEY(order_id) REFERENCES Orders(id), FOREIGN KEY(part_id) REFERENCES Parts(id))", (err) => {
                    if (err) reject(err);
                });
                resolve();
            });
        });

    });

    beforeEach(async () => {
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM Orders', [], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM OrderParts', [], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM Parts', [], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO Parts (id, name, price, work_hours, availability) VALUES (1, 'Part A', 10.0, 2.0, 10)",
                [],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        const response = await request(app).post('/api/orders').send({
            client_name: 'John Doe',
            parts: [
                { part_id: 1, quantity: 2 }
            ]
        });

        createdOrderId = response.body.order_id;
    });

    afterAll(done => {
        db.close(done);
    });

    it('GET /api/orders/:id should return order details for a given ID', async () => {
        const response = await request(app).get(`/api/orders/${createdOrderId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdOrderId);
        expect(response.body.client_name).toBe('John Doe');
    });

    it('DELETE /api/orders/:id should delete an order', async () => {
        const response = await request(app).delete(`/api/orders/${createdOrderId}`);
        expect(response.status).toBe(204);

        const checkResponse = await request(app).get(`/api/orders/${createdOrderId}`);
        expect(checkResponse.status).toBe(404);
    });
});
