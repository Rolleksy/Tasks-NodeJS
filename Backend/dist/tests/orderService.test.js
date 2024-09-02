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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderService_1 = __importDefault(require("../src/services/orderService"));
const database_1 = require("../src/database");
let db;
let orderService;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    db = database_1.database.getPartsDb();
    orderService = new orderService_1.default();
    // Przygotowanie bazy danych
    yield db.run('CREATE TABLE IF NOT EXISTS Parts (id INTEGER PRIMARY KEY, name TEXT, price REAL, work_hours REAL, availability INTEGER)');
    yield db.run('CREATE TABLE IF NOT EXISTS Orders (id INTEGER PRIMARY KEY, client_name TEXT, order_date TEXT, total_cost REAL, labor_cost REAL, total_time REAL, ETADelivery TEXT)');
    yield db.run('CREATE TABLE IF NOT EXISTS OrderParts (id INTEGER PRIMARY KEY, order_id INTEGER, part_id INTEGER, quantity INTEGER)');
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // Cleanup
    yield db.run('DROP TABLE IF EXISTS Parts');
    yield db.run('DROP TABLE IF EXISTS Orders');
    yield db.run('DROP TABLE IF EXISTS OrderParts');
}));
test('should create a new order', () => __awaiter(void 0, void 0, void 0, function* () {
    // Przygotowanie danych testowych
    yield db.run('INSERT INTO Parts (id, name, price, work_hours, availability) VALUES (?, ?, ?, ?, ?)', [1, 'Part A', 10, 2, 100]);
    const orderData = {
        client_name: 'Test Client',
        total_cost: 100,
        labor_cost: 20,
        total_time: 10,
        ETADelivery: '2024-09-01',
        parts: [{ part_id: 1, quantity: 5 }]
    };
    const result = yield orderService.createOrder(orderData);
    expect(result).toHaveProperty('order_id');
}));
test('should fetch orders', () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.run('INSERT INTO Orders (client_name, order_date, total_cost, labor_cost, total_time, ETADelivery) VALUES (?, ?, ?, ?, ?, ?)', [
        'Test Client',
        '2024-08-30',
        100,
        20,
        2,
        '2024-09-01'
    ]);
    const orders = yield orderService.getOrders();
    expect(orders).toHaveLength(1);
    expect(orders[0]).toMatchObject({
        Client: 'Test Client',
        Date: '2024-08-30',
        Total_Cost: '$100.00',
        Labor_Cost: '$20.00',
        Parts_Cost: '$80.00',
        Total_Time: '2 hours',
        ETA_Delivery: '2024-09-01'
    });
}));
test('should fetch order details', () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.run('INSERT INTO Orders (client_name, order_date, total_cost, labor_cost, total_time, ETADelivery) VALUES (?, ?, ?, ?, ?, ?)', [
        'Test Client',
        '2024-08-30',
        100,
        20,
        2,
        '2024-09-01'
    ]);
    yield db.run('INSERT INTO OrderParts (order_id, part_id, quantity) VALUES (?, ?, ?)', [1, 1, 5]);
    const details = yield orderService.getOrderDetails(1);
    expect(details).not.toBeNull();
    expect(details === null || details === void 0 ? void 0 : details.parts).toHaveLength(1);
}));
test('should delete an order', () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.run('INSERT INTO Orders (client_name, order_date, total_cost, labor_cost, total_time, ETADelivery) VALUES (?, ?, ?, ?, ?, ?)', [
        'Test Client',
        '2024-08-30',
        100,
        20,
        2,
        '2024-09-01'
    ]);
    yield orderService.deleteOrder(1);
    const orders = yield db.all('SELECT * FROM Orders WHERE id = ?', [1]);
    expect(orders).toHaveLength(0);
}));
