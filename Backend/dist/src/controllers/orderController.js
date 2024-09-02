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
const orderService_1 = __importDefault(require("../services/orderService"));
class OrderController {
    constructor() {
        this.getOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.orderService.getOrders();
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getOrderDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const orderId = parseInt(req.params.id, 10);
            try {
                const orderDetails = yield this.orderService.getOrderDetails(orderId);
                if (!orderDetails) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                res.json(orderDetails);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.createOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = yield this.orderService.createOrder(req.body);
                res.status(201).json(orderId);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.deleteOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const orderId = parseInt(req.params.id, 10);
            try {
                yield this.orderService.deleteOrder(orderId);
                res.status(204).end();
            }
            catch (error) {
                if (error.message === 'Order not found') {
                    res.status(404).json({ error: 'Order not found' });
                }
                else {
                    res.status(500).json({ error: error.message });
                }
            }
        });
        this.orderService = new orderService_1.default();
    }
}
exports.default = OrderController;
