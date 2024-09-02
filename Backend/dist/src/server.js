"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const partRoute_1 = __importDefault(require("./routes/partRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
dotenv_1.default.config();
// CORS OPTIONS
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '5000', 10);
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)(corsOptions));
// DEFINING ROUTES
app.use('/auth', authRoute_1.default);
app.use('/api', partRoute_1.default);
app.use('/api', orderRoute_1.default);
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = server;
