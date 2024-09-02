"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const router = express_1.default.Router();
const authControllers = new authController_1.default();
// Register route
router.post('/register', authControllers.register);
// Login route
router.post('/login', authControllers.login);
exports.default = router;
