"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const laborRate = parseFloat(process.env.LABOR_RATE || '0');
class OrderService {
    constructor() {
        this.db = database_1.database.getPartsDb();
        if (!this.db) {
            console.error('Database initialization failed');
            throw new Error('Database is not initialized');
        }
        else {
            console.log('Database initialized successfully');
        }
    }
    queryDatabase(sql_1) {
        return __awaiter(this, arguments, void 0, function* (sql, params = []) {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        });
    }
    runDatabase(sql_1) {
        return __awaiter(this, arguments, void 0, function* (sql, params = []) {
            return new Promise((resolve, reject) => {
                this.db.run(sql, params, function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(this);
                    }
                });
            });
        });
    }
    getOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id, client_name, order_date, total_cost, labor_cost, total_time, ETADelivery
            FROM Orders
        `;
            return new Promise((resolve, reject) => {
                this.db.all(query, [], (err, rows) => {
                    if (err) {
                        console.error('Error fetching orders:', err.message);
                        return reject(err);
                    }
                    const orders = rows.map((order) => ({
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
        });
    }
    getOrderDetails(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
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
                this.db.all(query, [orderId], (err, rows) => {
                    if (err) {
                        console.error(`Error fetching order details for order ID ${orderId}:`, err.message);
                        return reject(err);
                    }
                    if (rows.length === 0) {
                        console.warn(`No details found for order ID ${orderId}`);
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
        });
    }
    addBusinessDays(startDate, days) {
        const date = new Date(startDate);
        let daysAdded = 0;
        while (daysAdded < days) {
            date.setDate(date.getDate() + 1);
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                daysAdded++;
            }
        }
        return date;
    }
    calculateTotalTime(totalWorkHours, maxDeliveryTime) {
        return totalWorkHours + maxDeliveryTime;
    }
    createOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parts, order_date = new Date().toISOString().split('T')[0] } = orderData, restOfOrderData = __rest(orderData, ["parts", "order_date"]);
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
            // Fetch part details
            const dbParts = yield this.queryDatabase(query);
            const partDetailsMap = new Map(dbParts.map(part => [part.part_id, part]));
            // Update parts with additional details
            const updatedParts = parts.map(part => {
                const details = partDetailsMap.get(part.part_id);
                if (!details) {
                    console.error(`Part ID ${part.part_id} not found in the database`);
                    return null;
                }
                return Object.assign(Object.assign({}, part), { price: details.price, work_hours: details.work_hours, availability: details.availability, delivery_time: details.delivery_time || 0 });
            }).filter(part => part !== null);
            // Calculate totals
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
            const totalTime = maxDeliveryTime > 0 ? this.calculateTotalTime(totalWorkHours, maxDeliveryTime) : totalWorkHours;
            const workDays = Math.ceil(totalTime / 8);
            const etaDate = this.addBusinessDays(order_date, workDays);
            const ETADelivery = etaDate.toISOString().split('T')[0];
            const orderDetails = Object.assign(Object.assign({}, restOfOrderData), { order_date, total_cost: totalCost + laborCost, labor_cost: laborCost, total_time: totalTime, ETADelivery });
            try {
                // Insert order
                const result = yield this.runDatabase("INSERT INTO Orders (client_name, order_date, total_cost, labor_cost, total_time, ETADelivery) VALUES (?, ?, ?, ?, ?, ?)", [orderDetails.client_name, orderDetails.order_date, orderDetails.total_cost, orderDetails.labor_cost, orderDetails.total_time, orderDetails.ETADelivery]);
                const orderId = result.lastID; // Use cast to sqlite3.RunResult
                // Insert order parts
                const insertOrderPartsPromises = updatedParts.map(part => {
                    return this.runDatabase("INSERT INTO OrderParts (order_id, part_id, quantity) VALUES (?, ?, ?)", [orderId, part.part_id, part.quantity]);
                });
                // Update parts availability
                const updatePartsPromises = partsToUpdate.map(part => {
                    return this.runDatabase("UPDATE Parts SET availability = ? WHERE id = ?", [part.newAvailability, part.id]);
                });
                yield Promise.all([...insertOrderPartsPromises, ...updatePartsPromises]);
                return { order_id: orderId };
            }
            catch (error) {
                console.error('Error creating order:', error);
                throw error;
            }
        });
    }
    deleteOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.serialize(() => {
                    this.db.run("BEGIN TRANSACTION");
                    // Delete parts for order
                    this.db.run("DELETE FROM OrderParts WHERE order_id = ?", [orderId], (err) => {
                        if (err) {
                            console.error(`Error deleting parts for order ID ${orderId}:`, err.message);
                            this.db.run("ROLLBACK");
                            return reject(err);
                        }
                        // Delete order
                        this.db.run("DELETE FROM Orders WHERE id = ?", [orderId], (err) => {
                            if (err) {
                                console.error(`Error deleting order ID ${orderId}:`, err.message);
                                this.db.run("ROLLBACK");
                                return reject(err);
                            }
                            this.db.run("COMMIT", (err) => {
                                if (err) {
                                    console.error(`Error committing transaction for deleting order ID ${orderId}:`, err.message);
                                    return reject(err);
                                }
                                resolve();
                            });
                        });
                    });
                });
            });
        });
    }
}
exports.default = OrderService;
