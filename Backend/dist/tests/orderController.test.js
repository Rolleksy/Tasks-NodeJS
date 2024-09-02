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
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const orderController_1 = __importDefault(require("../src/controllers/orderController"));
const orderService_1 = __importDefault(require("../src/services/orderService"));
jest.mock('../src/services/orderService');
describe('OrderController', () => {
    let app;
    let orderController;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        orderController = new orderController_1.default();
        app.get('/orders', orderController.getOrders);
        app.get('/orders/:id', orderController.getOrderDetails);
        app.post('/orders', orderController.createOrder);
        app.delete('/orders/:id', orderController.deleteOrder);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('GET /orders', () => {
        it('should return a list of orders', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockOrders = [{ id: 1, name: 'Order 1' }];
            orderService_1.default.prototype.getOrders.mockResolvedValue(mockOrders);
            const response = yield (0, supertest_1.default)(app).get('/orders');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockOrders);
        }));
        it('should return 500 if there is an error', () => __awaiter(void 0, void 0, void 0, function* () {
            orderService_1.default.prototype.getOrders.mockRejectedValue(new Error('Something went wrong'));
            const response = yield (0, supertest_1.default)(app).get('/orders');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Something went wrong' });
        }));
    });
    describe('GET /orders/:id', () => {
        it('should return order details for a valid order ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockOrderDetails = { id: 1, name: 'Order 1' };
            orderService_1.default.prototype.getOrderDetails.mockResolvedValue(mockOrderDetails);
            const response = yield (0, supertest_1.default)(app).get('/orders/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockOrderDetails);
        }));
        it('should return 404 if order not found', () => __awaiter(void 0, void 0, void 0, function* () {
            orderService_1.default.prototype.getOrderDetails.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app).get('/orders/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Order not found' });
        }));
        it('should return 500 if there is an error', () => __awaiter(void 0, void 0, void 0, function* () {
            orderService_1.default.prototype.getOrderDetails.mockRejectedValue(new Error('Something went wrong'));
            const response = yield (0, supertest_1.default)(app).get('/orders/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Something went wrong' });
        }));
    });
    describe('POST /orders', () => {
        it('should create a new order and return its ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockOrderId = 1;
            orderService_1.default.prototype.createOrder.mockResolvedValue(mockOrderId);
            const response = yield (0, supertest_1.default)(app).post('/orders').send({ name: 'Order 1' });
            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockOrderId);
        }));
        it('should return 500 if there is an error', () => __awaiter(void 0, void 0, void 0, function* () {
            orderService_1.default.prototype.createOrder.mockRejectedValue(new Error('Something went wrong'));
            const response = yield (0, supertest_1.default)(app).post('/orders').send({ name: 'Order 1' });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Something went wrong' });
        }));
    });
    describe('DELETE /orders/:id', () => {
        it('should delete an order and return 204', () => __awaiter(void 0, void 0, void 0, function* () {
            orderService_1.default.prototype.deleteOrder.mockResolvedValue(undefined);
            const response = yield (0, supertest_1.default)(app).delete('/orders/1');
            expect(response.status).toBe(204);
        }));
        it('should return 404 if order not found', () => __awaiter(void 0, void 0, void 0, function* () {
            orderService_1.default.prototype.deleteOrder.mockRejectedValue(new Error('Order not found'));
            const response = yield (0, supertest_1.default)(app).delete('/orders/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Order not found' });
        }));
        it('should return 500 if there is an error', () => __awaiter(void 0, void 0, void 0, function* () {
            orderService_1.default.prototype.deleteOrder.mockRejectedValue(new Error('Something went wrong'));
            const response = yield (0, supertest_1.default)(app).delete('/orders/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Something went wrong' });
        }));
    });
});
