import  Database  from '../database/database';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import {IDatabase} from '../database/Idatabase';

dotenv.config();

// Labor rate per hour its in the .env file
const laborRate = parseFloat(process.env.LABOR_RATE || '0');

interface Part {
    part_id: number;
    quantity: number;
    price?: number;
    work_hours?: number;
    availability?: number;
    delivery_time?: number;
}

interface Order {
    id?: number;
    client_name: string;
    order_date?: string;
    total_cost: number;
    labor_cost: number;
    total_time: number;
    ETADelivery: string;
    parts: Part[];
}

interface OrderDetail {
    id: number;
    client_name: string;
    order_date: string;
    total_cost: number;
    labor_cost: number;
    total_time: number;
    parts: Array<{
        part_id: number;
        part_name: string;
        quantity: number;
        price: number;
        work_hours: number;
    }>;
}

class OrderService {
    private db: IDatabase;

    constructor() {
        this.db = Database.getInstance();

        if (!this.db) {
            console.error('Database initialization failed');
            throw new Error('Database is not initialized');
        } else {
            console.log('Database initialized successfully');
        }
    }

    private queryDatabase<T>(sql: string, params: any[] = []): Promise<T[]> {
        return this.db.all<T>(sql, params);
    }
    private runDatabase(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
        return this.db.run(sql, params);
    }

    public async getOrders(): Promise<Array<{
        id: number;
        Date: string;
        Client: string;
        Total_Cost: string;
        Labor_Cost: string;
        Parts_Cost: string;
        Total_Time: string;
        ETA_Delivery: string;
    }>> {
        const query = `
            SELECT id, client_name, order_date, total_cost, labor_cost, total_time, ETADelivery
            FROM Orders
        `;

        try {
            const rows = await this.queryDatabase<any>(query);
            return rows.map((order: any) => ({
                id: order.id,
                Date: order.order_date,
                Client: order.client_name,
                Total_Cost: `$${order.total_cost.toFixed(2)}`,
                Labor_Cost: `$${order.labor_cost.toFixed(2)}`,
                Parts_Cost: `$${(order.total_cost - order.labor_cost).toFixed(2)}`,
                Total_Time: `${order.total_time} hours`,
                ETA_Delivery: order.ETADelivery
            }));
        } catch (err: Error | any) {
            console.error('Error fetching orders:', err.message);
            throw err;
        }
    }
    // 
    public async getOrderDetails(orderId: number): Promise<OrderDetail | null> {
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

        try {
            const rows = await this.queryDatabase<any>(query, [orderId]);
            if (rows.length === 0) {
                console.warn(`No details found for order ID ${orderId}`);
                return null;
            }

            return {
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
        } catch (err: Error | any) {
            console.error(`Error fetching order details for order ID ${orderId}:`, err.message);
            throw err;
        }
    }

    // Method to add business days to a date, excluding weekends
    private addBusinessDays(startDate: string, days: number): Date {
        const date = new Date(startDate);
        let daysAdded = 0;
        while (daysAdded < days) {
            date.setDate(date.getDate() + 1);
            // Skip weekends
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                daysAdded++;
            }
        }

        return date;
    }
    // Redundant method
    private calculateTotalTime(totalWorkHours: number, maxDeliveryTime: number): number {
        return totalWorkHours + maxDeliveryTime;
    }

    public async createOrder(orderData: Order): Promise<{ order_id: number }> {
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

        try {
            // Fetch part details
            const dbParts = await this.queryDatabase<any>(query);
            const partDetailsMap = new Map<number, any>(dbParts.map(part => [part.part_id, part]));

            // Update parts with additional details
            const updatedParts = parts.map(part => {
                const details = partDetailsMap.get(part.part_id);
                if (!details) {
                    console.error(`Part ID ${part.part_id} not found in the database`);
                    return null;
                }
                return {
                    ...part,
                    price: details.price,
                    work_hours: details.work_hours,
                    availability: details.availability,
                    delivery_time: details.delivery_time || 0
                };
            }).filter(part => part !== null) as Part[];

            // Calculate totals
            let totalCost = 0;
            let totalWorkHours = 0;
            let maxDeliveryTime = 0;
            const partsToUpdate: Array<{ id: number, newAvailability: number }> = [];

            updatedParts.forEach(part => {
                const { price, work_hours, availability, delivery_time } = part;

                if (part.quantity > availability!) {
                    maxDeliveryTime = Math.max(maxDeliveryTime, delivery_time!);
                }

                totalCost += (price! * part.quantity || 0);
                totalWorkHours += (work_hours! * part.quantity || 0);

                // Calculate new availability, ensuring it doesn't go below 0
                const newAvailability = Math.max(0, availability! - part.quantity);
                partsToUpdate.push({ id: part.part_id, newAvailability });
            });

            const laborCost = totalWorkHours * laborRate;
            const totalTime = maxDeliveryTime > 0 ? this.calculateTotalTime(totalWorkHours, maxDeliveryTime) : totalWorkHours;
            const workDays = Math.ceil(totalTime / 8);
            const etaDate = this.addBusinessDays(order_date, workDays);
            const ETADelivery = etaDate.toISOString().split('T')[0];

            const orderDetails = {
                ...restOfOrderData,
                order_date,
                total_cost: totalCost + laborCost,
                labor_cost: laborCost,
                total_time: totalTime,
                ETADelivery
            };

            // Insert order in the database
            const result = await this.runDatabase(
                "INSERT INTO Orders (client_name, order_date, total_cost, labor_cost, total_time, ETADelivery) VALUES (?, ?, ?, ?, ?, ?)",
                [orderDetails.client_name, orderDetails.order_date, orderDetails.total_cost, orderDetails.labor_cost, orderDetails.total_time, orderDetails.ETADelivery]
            );

            // Get the ID of the newly created order for linking parts
            const orderId = (result as sqlite3.RunResult).lastID;

            // Insert order parts in the database, linking them to the order
            const insertOrderPartsPromises = updatedParts.map(part => {
                return this.runDatabase(
                    "INSERT INTO OrderParts (order_id, part_id, quantity) VALUES (?, ?, ?)",
                    [orderId, part.part_id, part.quantity]
                );
            });

            await Promise.all(insertOrderPartsPromises);

            // Update parts availability
            const updatePartsPromises = partsToUpdate.map(part => {
                return this.runDatabase(
                    "UPDATE Parts SET availability = ? WHERE id = ?",
                    [part.newAvailability, part.id]
                );
            });

            await Promise.all(updatePartsPromises);

            return { order_id: orderId };
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    public async deleteOrder(orderId: number): Promise<void> {
        try {
            // Delete order parts
            await this.runDatabase(
                "DELETE FROM OrderParts WHERE order_id = ?",
                [orderId]
            );

            // Delete the order
            await this.runDatabase(
                "DELETE FROM Orders WHERE id = ?",
                [orderId]
            );
        } catch (error) {
            console.error(`Error deleting order ID ${orderId}:`, error);
            throw error;
        }
    }
}

export default OrderService;
