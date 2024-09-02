"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const bcrypt = __importStar(require("bcrypt"));
const JWTCreate_1 = __importDefault(require("../JWTManager/JWTCreate"));
const JWTVerify_1 = __importDefault(require("../JWTManager/JWTVerify"));
const userModel_1 = __importDefault(require("../models/userModel"));
const moment = require("moment");
// Secret key for JWT
const SECRET_KEY = process.env.SECRET || '';
class AuthController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const hashedPassword = bcrypt.hashSync(password, 10);
            userModel_1.default.createUser(username, hashedPassword, (err, userId) => {
                if (err) {
                    res.status(500).send('Error registering new user');
                    return;
                }
                res.status(201).send('User registered');
            });
        });
        this.login = (req, res) => {
            const { username, password } = req.body;
            userModel_1.default.findUserByUsername(username, (err, user) => {
                if (err || !user || !bcrypt.compareSync(password, user.password)) {
                    res.status(401).send('Invalid username or password');
                    return;
                }
                const payload = {
                    id: user.id,
                    username: user.username,
                    exp: moment().add(1, "hour").unix()
                };
                const token = JWTCreate_1.default.createJwt({ alg: 'HS256', typ: 'JWT' }, payload, SECRET_KEY);
                res.status(200).json({ token });
            });
        };
        this.verifyToken = (req, res, next) => {
            var _a;
            const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.replace(/^Bearer\s/, '');
            if (!token) {
                res.status(401).send('Access denied. No token provided.');
                return;
            }
            try {
                const decoded = JWTVerify_1.default.verifyJwt(token, SECRET_KEY);
                req.user = decoded;
                next();
            }
            catch (error) {
                res.status(400).send('Invalid token');
            }
        };
    }
}
exports.default = AuthController;
