import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import JWTCreate from '../src/JWTManager/JWTCreate';
import JWTVerify from '../src/JWTManager/JWTVerify';
import userService from '../src/models/userModel';
import AuthController from '../src/controllers/authController'; // Adjust path as needed

// Mock the dependencies
jest.mock('bcrypt');
jest.mock('../src/JWTManager/JWTCreate');
jest.mock('../src/JWTManager/JWTVerify');
jest.mock('../src/models/userModel');

describe('AuthController', () => {
    let authController: AuthController;
    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn();
        res.json = jest.fn();
        return res;
    };

    const mockRequest = (body = {}) => ({
        body,
    } as Request);

    const mockNext = jest.fn() as NextFunction;

    beforeEach(() => {
        authController = new AuthController();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const req = mockRequest({ username: 'testuser', password: 'password' });
            const res = mockResponse();

            // Mock bcrypt.hashSync
            (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');

            // Mock userService.createUser
            (userService.createUser as jest.Mock).mockImplementation((username, hashedPassword, callback) => {
                callback(null, 1); // Simulate successful user creation
            });

            await authController.register(req, res);

            expect(bcrypt.hashSync).toHaveBeenCalledWith('password', 10);
            expect(userService.createUser).toHaveBeenCalledWith('testuser', 'hashedPassword', expect.any(Function));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith('User registered');
        });

        it('should handle errors during registration', async () => {
            const req = mockRequest({ username: 'testuser', password: 'password' });
            const res = mockResponse();

            // Mock bcrypt.hashSync
            (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');

            // Mock userService.createUser to simulate an error
            (userService.createUser as jest.Mock).mockImplementation((username, hashedPassword, callback) => {
                callback(new Error('Error'), null);
            });

            await authController.register(req, res);

            expect(bcrypt.hashSync).toHaveBeenCalledWith('password', 10);
            expect(userService.createUser).toHaveBeenCalledWith('testuser', 'hashedPassword', expect.any(Function));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error registering new user');
        });
    });

    describe('login', () => {
        it('should log in an existing user and return a token', () => {
            const req = mockRequest({ username: 'testuser', password: 'password' });
            const res = mockResponse();

            // Mock bcrypt.compareSync
            (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

            // Mock userService.findUserByUsername
            (userService.findUserByUsername as jest.Mock).mockImplementation((username, callback) => {
                callback(null, { id: 1, username: 'testuser', password: 'hashedPassword' });
            });

            // Mock JWTCreate.createJwt
            (JWTCreate.createJwt as jest.Mock).mockReturnValue('token');

            authController.login(req, res);

            expect(bcrypt.compareSync).toHaveBeenCalledWith('password', 'hashedPassword');
            expect(userService.findUserByUsername).toHaveBeenCalledWith('testuser', expect.any(Function));
            expect(JWTCreate.createJwt).toHaveBeenCalledWith(
                { alg: 'HS256', typ: 'JWT' },
                { id: 1, username: 'testuser', exp: expect.any(Number) },
                process.env.SECRET || ''
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'token' });
        });

        it('should handle login errors', () => {
            const req = mockRequest({ username: 'testuser', password: 'password' });
            const res = mockResponse();

            // Mock bcrypt.compareSync
            (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

            // Mock userService.findUserByUsername
            (userService.findUserByUsername as jest.Mock).mockImplementation((username, callback) => {
                callback(null, { id: 1, username: 'testuser', password: 'hashedPassword' });
            });

            authController.login(req, res);

            expect(bcrypt.compareSync).toHaveBeenCalledWith('password', 'hashedPassword');
            expect(userService.findUserByUsername).toHaveBeenCalledWith('testuser', expect.any(Function));
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('Invalid username or password');
        });
    });

    describe('verifyToken', () => {
        it('should verify a valid token and call next', () => {
            const req = {
                headers: { authorization: 'Bearer validToken' },
            } as unknown as Request;
            const res = mockResponse();

            // Mock JWTVerify.verifyJwt
            (JWTVerify.verifyJwt as jest.Mock).mockReturnValue({ userId: 1 });

            authController.verifyToken(req, res, mockNext);

            expect(JWTVerify.verifyJwt).toHaveBeenCalledWith('validToken', process.env.SECRET || '');
            expect((req as any).user).toEqual({ userId: 1 });
            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 401 if no token is provided', () => {
            const req = { headers: {} } as unknown as Request;
            const res = mockResponse();

            authController.verifyToken(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('Access denied. No token provided.');
        });

        it('should return 400 if the token is invalid', () => {
            const req = {
                headers: { authorization: 'Bearer invalidToken' },
            } as unknown as Request;
            const res = mockResponse();

            // Mock JWTVerify.verifyJwt to throw an error
            (JWTVerify.verifyJwt as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            authController.verifyToken(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Invalid token');
        });
    });
});
