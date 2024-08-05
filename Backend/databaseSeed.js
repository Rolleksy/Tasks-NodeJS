const { partsDb } = require('./database');

// Seed warehouses
const warehouses = [
    { name: 'Warehouse A', delivery_time: 24 },
    { name: 'Warehouse B', delivery_time: 48 }
];

// Seed parts
const parts = [
    { name: 'Brake Pads', availability: 10, work_hours: 4, warehouse_id: 1, price: 100.0 },
    { name: 'Oil Filter', availability: 20, work_hours: 1, warehouse_id: 2, price: 25.0 },
    { name: 'Air Filter', availability: 15, work_hours: 1, warehouse_id: 1, price: 30.0 },
    { name: 'Spark Plugs', availability: 30, work_hours: 2, warehouse_id: 2, price: 50.0 }
];

// Seed orders
const orders = [
    { client_name: 'John Doe', order_date: '2023-08-01' },
    { client_name: 'Jane Smith', order_date: '2023-08-02' }
];

// Seed order parts
const orderParts = [
    { order_id: 1, part_id: 1, quantity: 4 },
    { order_id: 1, part_id: 2, quantity: 1 },
    { order_id: 2, part_id: 3, quantity: 2 }
];

const seedDatabase = () => {
    // Insert warehouses
    warehouses.forEach((warehouse) => {
        partsDb.run(
            `INSERT INTO Warehouse (name, delivery_time) VALUES (?, ?)`,
            [warehouse.name, warehouse.delivery_time],
            (err) => {
                if (err) {
                    console.error(`Error seeding warehouse: ${err.message}`);
                }
            }
        );
    });

    // Insert parts
    parts.forEach((part) => {
        partsDb.run(
            `INSERT INTO Parts (name, availability, work_hours, warehouse_id, price) VALUES (?, ?, ?, ?, ?)`,
            [part.name, part.availability, part.work_hours, part.warehouse_id, part.price],
            (err) => {
                if (err) {
                    console.error(`Error seeding parts: ${err.message}`);
                }
            }
        );
    });

    // Insert orders
    orders.forEach((order) => {
        partsDb.run(
            `INSERT INTO Orders (client_name, order_date) VALUES (?, ?)`,
            [order.client_name, order.order_date],
            (err) => {
                if (err) {
                    console.error(`Error seeding orders: ${err.message}`);
                }
            }
        );
    });

    // Insert order parts
    orderParts.forEach((orderPart) => {
        partsDb.run(
            `INSERT INTO OrderParts (order_id, part_id, quantity) VALUES (?, ?, ?)`,
            [orderPart.order_id, orderPart.part_id, orderPart.quantity],
            (err) => {
                if (err) {
                    console.error(`Error seeding order parts: ${err.message}`);
                }
            }
        );
    });
};

seedDatabase();
