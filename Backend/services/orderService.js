const { partsDb } = require('../database');
const dotenv = require('dotenv');
dotenv.config();

const laborRate = process.env.LABOR_RATE;

const getOrders = async () => {
    const query = `
        SELECT id, client_name, order_date, total_cost, labor_cost, total_time, ETADelivery
        FROM Orders
    `;

    return new Promise((resolve, reject) => {
        partsDb.all(query, [], (err, rows) => {
            if (err) {
                return reject(err);
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

            resolve(orders);
        });
    });
};

const getOrderDetails = async (orderId) => {
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

    return new Promise((resolve, reject) => {
        partsDb.all(query, [orderId], (err, rows) => {
            if (err) {
                return reject(err);
            }

            if (rows.length === 0) {
                return resolve(null);
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

            resolve(orderDetails);
        });
    });
};

const addBusinessDays = (startDate, days) => {
    const date = new Date(startDate);
    let daysAdded = 0;

    while (daysAdded < days) {
        date.setDate(date.getDate() + 1);
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            daysAdded++;
        }
    }

    return date;
};

const calculateTotalTime = (totalWorkHours, maxDeliveryTime) => {
    return totalWorkHours + maxDeliveryTime;
};

const createOrder = async (orderData) => {
    const { parts, order_date = new Date().toISOString().split('T')[0], ...restOfOrderData } = orderData;

    if (!Array.isArray(parts) || parts.length === 0) {
        throw new Error('Parts array is missing or empty');
    }

    const partIds = parts.map(part => part.part_id);
    const query = `
        SELECT p.id AS part_id, p.price, p.work_hours, p.availability, w.delivery_time
        FROM Parts p
        LEFT JOIN Warehouse w ON p.warehouse_id = w.id
        WHERE p.id IN (${partIds.join(',')})
    `;

    return new Promise((resolve, reject) => {
        partsDb.all(query, [], (err, dbParts) => {
            if (err) {
                return reject(err);
            }

            const partDetailsMap = new Map(dbParts.map(part => [part.part_id, part]));

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
                    delivery_time: details.delivery_time || 0
                };
            }).filter(part => part !== null);

            let totalCost = 0;
            let totalWorkHours = 0;
            let maxDeliveryTime = 0;
            const partsToUpdate = [];

            updatedParts.forEach(part => {
                const { price, work_hours, availability, delivery_time } = part;

                if (part.quantity > availability) {
                    maxDeliveryTime = Math.max(maxDeliveryTime, delivery_time);
                }

                totalCost += (price * part.quantity || 0);
                totalWorkHours += (work_hours * part.quantity || 0);

                const newAvailability = Math.max(0, availability - part.quantity);
                partsToUpdate.push({ id: part.part_id, newAvailability });
            });

            const laborCost = totalWorkHours * laborRate;
            const totalTime = maxDeliveryTime > 0 ? calculateTotalTime(totalWorkHours, maxDeliveryTime) : totalWorkHours;

            const workDays = Math.ceil(totalTime / 8);
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
                partsDb.run(
                    "INSERT INTO Orders (client_name, order_date, total_cost, labor_cost, total_time, ETADelivery) VALUES (?, ?, ?, ?, ?, ?)",
                    [orderDetails.client_name, orderDetails.order_date, orderDetails.total_cost, orderDetails.labor_cost, orderDetails.total_time, orderDetails.ETADelivery],
                    function (err) {
                        if (err) {
                            return reject(err);
                        }

                        const orderId = this.lastID;

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
                            .then(() => resolve({ order_id: orderId }))
                            .catch(error => reject(error));
                    }
                );
            });
        });
    });
};

const deleteOrder = async (orderId) => {
    const getOrderPartsQuery = "SELECT part_id, quantity FROM OrderParts WHERE order_id = ?";

    return new Promise((resolve, reject) => {
        partsDb.all(getOrderPartsQuery, [orderId], (err, parts) => {
            if (err) {
                return reject(err);
            }

            if (parts.length === 0) {
                return resolve(false);
            }

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
                    partsDb.run("DELETE FROM OrderParts WHERE order_id = ?", [orderId], (err) => {
                        if (err) {
                            return reject(err);
                        }

                        partsDb.run("DELETE FROM Orders WHERE id = ?", [orderId], function (err) {
                            if (err) {
                                return reject(err);
                            }
                            if (this.changes === 0) {
                                return resolve(false);
                            }
                            resolve(true);
                        });
                    });
                })
                .catch((error) => reject(error));
        });
    });
};

module.exports = {
    getOrders,
    getOrderDetails,
    createOrder,
    deleteOrder
};
