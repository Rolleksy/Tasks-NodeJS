const { partsDb } = require('../database');
const dotenv = require('dotenv');
dotenv.config();

const laborRate = process.env.LABOR_RATE;


// Get all orders - its used to display orders in the frontend
const getOrders = (req, res) => {
    const query = `
        SELECT o.id, o.client_name, o.order_date,
               SUM(p.price * op.quantity) AS parts_cost,
               SUM(p.work_hours * op.quantity) AS total_work_hours,
               MAX(CASE WHEN p.availability < op.quantity THEN w.delivery_time ELSE 0 END) AS max_delivery_time
        FROM Orders o
        JOIN OrderParts op ON o.id = op.order_id
        JOIN Parts p ON op.part_id = p.id
        JOIN Warehouse w ON p.warehouse_id = w.id
        GROUP BY o.id, o.client_name, o.order_date
        ORDER BY o.order_date ASC
    `;

    partsDb.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ error: err.message });
        }
        // Calculate total cost, labor cost and total time for each order
        const orders = rows.map(order => {
            const laborCost = order.total_work_hours * laborRate;
            const totalCost = order.parts_cost + laborCost;
            const totalTime = calculateTotalTime(order.total_work_hours, order.max_delivery_time);

            return {
                ...order,
                total_cost: totalCost,
                labor_cost: laborCost,
                total_time: totalTime,
                
            };
        });

        res.json(orders);
    });
};

// Get order details - its used to display details of a specific order in the frontend - on click
const getOrderDetails = (req, res) => {
    const orderId = req.params.id;
    const query = `
        SELECT p.name, op.quantity, p.price, p.work_hours, w.name AS warehouse_name, w.delivery_time, p.availability
        FROM OrderParts op
        JOIN Parts p ON op.part_id = p.id
        JOIN Warehouse w ON p.warehouse_id = w.id
        WHERE op.order_id = ?
    `;

    partsDb.all(query, [orderId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const totalCost = rows.reduce((total, row) => total + row.price * row.quantity, 0);
        const totalWorkHours = rows.reduce((total, row) => total + row.work_hours * row.quantity, 0);
        const maxDeliveryTime = Math.max(...rows.map(row => (row.availability < row.quantity ? row.delivery_time : 0)));
        const laborCost = totalWorkHours * laborRate;
        const totalTime = calculateTotalTime(totalWorkHours, maxDeliveryTime);

        partsDb.get("SELECT order_date FROM Orders WHERE id = ?", [orderId], (err, orderRow) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
    

            res.json({ 
                details: rows, 
                total_cost: totalCost + laborCost, 
                labor_cost: laborCost,
                total_time: totalTime
            });
        });
    });
};

const calculateTotalTime = (totalWorkHours, maxDeliveryTime) => {
    return totalWorkHours + maxDeliveryTime;
};

// Create order - its used to add a new order in the frontend
const createOrder = (req, res) => {
    const { client_name, parts } = req.body;
    const insertOrderQuery = "INSERT INTO Orders (client_name, order_date) VALUES (?, datetime('now'))";

    partsDb.run(insertOrderQuery, [client_name], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const orderId = this.lastID;

        // Adding parts to the order
        const insertPartQuery = "INSERT INTO OrderParts (order_id, part_id, quantity) VALUES (?, ?, ?)";
        // Update availability of parts in parts table
        const updatePartQuery = "UPDATE Parts SET availability = ? WHERE id = ?";
        const promises = parts.map(part =>
            new Promise((resolve, reject) => {
                partsDb.get("SELECT availability FROM Parts WHERE id = ?", [part.part_id], (err, row) => {
                    if (err) reject(err);
                    else {
                        const newAvailability = row.availability - part.quantity;
                        const updatedAvailability = Math.max(newAvailability, 0); // make sure availability is not negative
                        partsDb.run(insertPartQuery, [orderId, part.part_id, part.quantity], (err) => {
                            if (err) reject(err);
                            else {
                                partsDb.run(updatePartQuery, [updatedAvailability, part.part_id], (err) => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            }
                        });
                    }
                });
            })
        );

        Promise.all(promises)
            .then(() => res.status(201).json({ id: orderId, client_name, order_date: new Date().toISOString() }))
            .catch((error) => res.status(500).json({ error: error.message }));
    });
};

const deleteOrder = (req, res) => {
    const orderId = req.params.id;

    // Get parts of the order before deletion, so we can restore their availability
    const getOrderPartsQuery = "SELECT part_id, quantity FROM OrderParts WHERE order_id = ?";
    partsDb.all(getOrderPartsQuery, [orderId], (err, parts) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (parts.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Restore availability of parts in parts table
        const updatePartPromises = parts.map(part =>
            new Promise((resolve, reject) => {
                partsDb.get("SELECT availability FROM Parts WHERE id = ?", [part.part_id], (err, row) => {
                    if (err) reject(err);
                    else {
                        const newAvailability = row.availability + part.quantity;
                        partsDb.run("UPDATE Parts SET availability = ? WHERE id = ?", [newAvailability, part.part_id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            })
        );

        Promise.all(updatePartPromises)
            .then(() => {
                // Delete order and its parts
                partsDb.run("DELETE FROM OrderParts WHERE order_id = ?", [orderId], (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    partsDb.run("DELETE FROM Orders WHERE id = ?", [orderId], function (err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        if (this.changes === 0) {
                            return res.status(404).json({ error: "Order not found" });
                        }
                        res.status(204).end();
                    });
                });
            })
            .catch((error) => res.status(500).json({ error: error.message }));
    });
};

module.exports = {
    getOrders,
    getOrderDetails,
    createOrder,
    deleteOrder
};
