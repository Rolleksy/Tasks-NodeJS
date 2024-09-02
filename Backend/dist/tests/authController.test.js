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
const bcrypt_1 = __importDefault(require("bcrypt"));
const JWTCreate_1 = __importDefault(require("../src/JWTManager/JWTCreate"));
const JWTVerify_1 = __importDefault(require("../src/JWTManager/JWTVerify"));
const userModel_1 = __importDefault(require("../src/models/userModel"));
const authController_1 = __importDefault(require("../src/controllers/authController")); // Adjust path as needed
// Mock the dependencies
jest.mock('bcrypt');
jest.mock('../src/JWTManager/JWTCreate');
jest.mock('../src/JWTManager/JWTVerify');
jest.mock('../src/models/userModel');
describe('AuthController', () => {
    let authController;
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn();
        res.json = jest.fn();
        return res;
    };
    const mockRequest = (body = {}) => ({
        body,
    });
    const mockNext = jest.fn();
    beforeEach(() => {
        authController = new authController_1.default();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('register', () => {
        it('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ username: 'testuser', password: 'password' });
            const res = mockResponse();
            // Mock bcrypt.hashSync
            bcrypt_1.default.hashSync.mockReturnValue('hashedPassword');
            // Mock userService.createUser
            userModel_1.default.createUser.mockImplementation((username, hashedPassword, callback) => {
                callback(null, 1); // Simulate successful user creation
            });
            yield authController.register(req, res);
            expect(bcrypt_1.default.hashSync).toHaveBeenCalledWith('password', 10);
            expect(userModel_1.default.createUser).toHaveBeenCalledWith('testuser', 'hashedPassword', expect.any(Function));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith('User registered');
        }));
        it('should handle errors during registration', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ username: 'testuser', password: 'password' });
            const res = mockResponse();
            // Mock bcrypt.hashSync
            bcrypt_1.default.hashSync.mockReturnValue('hashedPassword');
            // Mock userService.createUser to simulate an error
            userModel_1.default.createUser.mockImplementation((username, hashedPassword, callback) => {
                callback(new Error('Error'), null);
            });
            yield authController.register(req, res);
            expect(bcrypt_1.default.hashSync).toHaveBeenCalledWith('password', 10);
            expect(userModel_1.default.createUser).toHaveBeenCalledWith('testuser', 'hashedPassword', expect.any(Function));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error registering new user');
        }));
    });
    describe('login', () => {
        it('should log in an existing user and return a token', () => {
            const req = mockRequest({ username: 'testuser', password: 'password' });
            const res = mockResponse();
            // Mock bcrypt.compareSync
            bcrypt_1.default.compareSync.mockReturnValue(true);
            // Mock userService.findUserByUsername
            userModel_1.default.findUserByUsername.mockImplementation((username, callback) => {
                callback(null, { id: 1, username: 'testuser', password: 'hashedPassword' });
            });
            // Mock JWTCreate.createJwt
            JWTCreate_1.default.createJwt.mockReturnValue('token');
            authController.login(req, res);
            expect(bcrypt_1.default.compareSync).toHaveBeenCalledWith('password', 'hashedPassword');
            expect(userModel_1.default.findUserByUsername).toHaveBeenCalledWith('testuser', expect.any(Function));
            expect(JWTCreate_1.default.createJwt).toHaveBeenCalledWith({ alg: 'HS256', typ: 'JWT' }, { id: 1, username: 'testuser', exp: expect.any(Number) }, process.env.SECRET || '');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'token' });
        });
        it('should handle login errors', () => {
            const req = mockRequest({ username: 'testuser', password: 'password' });
            const res = mockResponse();
            // Mock bcrypt.compareSync
            bcrypt_1.default.compareSync.mockReturnValue(false);
            // Mock userService.findUserByUsername
            userModel_1.default.findUserByUsername.mockImplementation((username, callback) => {
                callback(null, { id: 1, username: 'testuser', password: 'hashedPassword' });
            });
            authController.login(req, res);
            expect(bcrypt_1.default.compareSync).toHaveBeenCalledWith('password', 'hashedPassword');
            expect(userModel_1.default.findUserByUsername).toHaveBeenCalledWith('testuser', expect.any(Function));
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('Invalid username or password');
        });
    });
    describe('verifyToken', () => {
        it('should verify a valid token and call next', () => {
            const req = {
                headers: { authorization: 'Bearer validToken' },
            };
            const res = mockResponse();
            // Mock JWTVerify.verifyJwt
            JWTVerify_1.default.verifyJwt.mockReturnValue({ userId: 1 });
            authController.verifyToken(req, res, mockNext);
            expect(JWTVerify_1.default.verifyJwt).toHaveBeenCalledWith('validToken', process.env.SECRET || '');
            expect(req.user).toEqual({ userId: 1 });
            expect(mockNext).toHaveBeenCalled();
        });
        it('should return 401 if no token is provided', () => {
            const req = { headers: {} };
            const res = mockResponse();
            authController.verifyToken(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('Access denied. No token provided.');
        });
        it('should return 400 if the token is invalid', () => {
            const req = {
                headers: { authorization: 'Bearer invalidToken' },
            };
            const res = mockResponse();
            // Mock JWTVerify.verifyJwt to throw an error
            JWTVerify_1.default.verifyJwt.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            authController.verifyToken(req, res, mockNext);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Invalid token');
        });
    });
});
