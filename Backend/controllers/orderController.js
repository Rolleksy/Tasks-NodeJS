const { partsDb } = require('../database');
const dotenv = require('dotenv');
dotenv.config();

const laborRate = process.env.LABOR_RATE;

// Get all orders - used to display orders in the frontend
const getOrders = (req, res) => {
    const query = `
        SELECT id, client_name, order_date, total_cost, labor_cost, total_time, ETADelivery
        FROM Orders
    `;

    partsDb.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const orders = rows.map(order => ({
            id: order.id,
            Date: order.order_date,
            Client: order.client_name,
            Total_Cost: `$${order.total_cost.toFixed(2)}`,
            Labor_Cost: `$${order.labor_cost.toFixed(2)}`,
            Parts_Cost: `$${(order.total_cost - order.labor_cost).toFixed(2)}`, 
            Total_Time: `${order.total_time} hours`,
            ETA_Delivery: order.ETADelivery
        }));

        res.json(orders);
    });
};

// Get order details - used to display details of a specific order in the frontend - on click
const getOrderDetails = (req, res) => {
    const orderId = parseInt(req.params.id, 10);

    // SQL query to fetch order details - connected to the Orders, OrderParts, and Parts tables
    const query = `
        SELECT 
            o.id AS order_id,
            o.client_name,
            o.order_date,
            o.total_cost,
            o.labor_cost,
            o.total_time,
            op.part_id,
            p.name AS part_name,
            op.quantity,
            p.price,
            p.work_hours
        FROM Orders o
        JOIN OrderParts op ON o.id = op.order_id
        JOIN Parts p ON op.part_id = p.id
        WHERE o.id = ?
    `;

    partsDb.all(query, [orderId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const orderDetails = {
            id: rows[0].order_id,
            client_name: rows[0].client_name,
            order_date: rows[0].order_date,
            total_cost: rows[0].total_cost,
            labor_cost: rows[0].labor_cost,
            total_time: rows[0].total_time,
            parts: rows.map(row => ({
                part_id: row.part_id,
                part_name: row.part_name,
                quantity: row.quantity,
                price: row.price,
                work_hours: row.work_hours
            }))
        };

        res.json(orderDetails);
    });
};

const addBusinessDays = (startDate, days) => {
    const date = new Date(startDate);
    let daysAdded = 0;

    while (daysAdded < days) {
        date.setDate(date.getDate() + 1);
        // Check if it's a weekend (Saturday or Sunday)
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            daysAdded++;
        }
    }

    return date;
};

const calculateTotalTime = (totalWorkHours, maxDeliveryTime) => {
    return totalWorkHours + maxDeliveryTime;
};

// Create order - used to add a new order in the frontend
const createOrder = (req, res) => {
    const orderData = req.body;

    const { parts, order_date = new Date().toISOString().split('T')[0], ...restOfOrderData } = orderData;

    if (!Array.isArray(parts) || parts.length === 0) {
        return res.status(400).json({ error: 'Parts array is missing or empty' });
    }

    // Fetch part details along with warehouse details - connecting the Parts and Warehouse tables
    const partIds = parts.map(part => part.part_id);
    const query = `
        SELECT p.id AS part_id, p.price, p.work_hours, p.availability, w.delivery_time
        FROM Parts p
        LEFT JOIN Warehouse w ON p.warehouse_id = w.id
        WHERE p.id IN (${partIds.join(',')})
    `;

    partsDb.all(query, [], (err, dbParts) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Create a map of part details
        const partDetailsMap = new Map(dbParts.map(part => [part.part_id, part]));

        // Update parts with details
        const updatedParts = parts.map(part => {
            const details = partDetailsMap.get(part.part_id);
            if (!details) {
                return null;
            }
            return {
                ...part,
                price: details.price,
                work_hours: details.work_hours,
                availability: details.availability,
                delivery_time: details.delivery_time || 0 // Default to 0 if not available
            };
        }).filter(part => part !== null);

        // Recalculate total cost, work hours
        let totalCost = 0;
        let totalWorkHours = 0;
        let maxDeliveryTime = 0;
        // Parts to update in the Parts table, to enable reducing its availability
        const partsToUpdate = [];

        updatedParts.forEach(part => {
            const { price, work_hours, availability, delivery_time } = part;

            // If ordered quantity exceeds available quantity, set maxDelivery to highest value in case of multiple parts
            if (part.quantity > availability) {
                maxDeliveryTime = Math.max(maxDeliveryTime, delivery_time);
            }

            // Calculate total cost and work hours
            totalCost += (price * part.quantity || 0);
            totalWorkHours += (work_hours * part.quantity || 0);

            // Update the availability of the part (do not go below zero)
            const newAvailability = Math.max(0, availability - part.quantity);
            partsToUpdate.push({ id: part.part_id, newAvailability });
        });

        const laborCost = totalWorkHours * laborRate;
        // Calculate total time (work hours + max delivery time) if max delivery time is greater than 0
        const totalTime = maxDeliveryTime > 0 ? calculateTotalTime(totalWorkHours, maxDeliveryTime) : totalWorkHours;

        // Calculate work days based on total time - round up to the nearest whole number
        const workDays = Math.ceil(totalTime / 8);  // Calculate work days based on total time

        // Calculate initial delivery date - it is needed to be calculated before adding business days
        const initialEtaDelivery = new Date(order_date);
        initialEtaDelivery.setHours(initialEtaDelivery.getHours() + maxDeliveryTime);
        
        // Add the bussiness days to the initial delivery date
        const etaDate = addBusinessDays(order_date, workDays);

        const ETADelivery = etaDate.toISOString().split('T')[0];


        const orderDetails = {
            ...restOfOrderData,
            order_date,
            total_cost: totalCost + laborCost,
            labor_cost: laborCost,
            total_time: totalTime,
            ETADelivery
        };

        partsDb.serialize(() => {
            // Insert the new order into the Orders table
            partsDb.run(
                "INSERT INTO Orders (client_name, order_date, total_cost, labor_cost, total_time, ETADelivery) VALUES (?, ?, ?, ?, ?, ?)",
                [orderDetails.client_name, orderDetails.order_date, orderDetails.total_cost, orderDetails.labor_cost, orderDetails.total_time, orderDetails.ETADelivery],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    const orderId = this.lastID;

                    // Insert the parts into OrderParts table
                    const insertOrderParts = updatedParts.map(part => {
                        return new Promise((resolve, reject) => {
                            partsDb.run(
                                "INSERT INTO OrderParts (order_id, part_id, quantity) VALUES (?, ?, ?)",
                                [orderId, part.part_id, part.quantity],
                                (err) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                }
                            );
                        });
                    });

                    // Update availability for parts in the Parts table
                    const updatePartAvailability = partsToUpdate.map(part => {
                        return new Promise((resolve, reject) => {
                            partsDb.run(
                                "UPDATE Parts SET availability = ? WHERE id = ?",
                                [part.newAvailability, part.id],
                                (err) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                }
                            );
                        });
                    });

                    Promise.all([...insertOrderParts, ...updatePartAvailability])
                        .then(() => res.status(201).json({ order_id: orderId }))
                        .catch(error => res.status(500).json({ error: error.message }));
                }
            );
        });
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

        // Restore number of parts after deleting the order
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

                    // its parts deleted
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
