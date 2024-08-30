const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const {
    register,
    login,
    verifyToken
} = require('../controllers/authController');
const userModel = require('../models/userModel');
const JWTCreate = require('../JWTManager/JWTCreate');
const JWTVerify = require('../JWTManager/JWTVerify');

jest.mock('../models/userModel');
jest.mock('../JWTManager/JWTCreate');
jest.mock('../JWTManager/JWTVerify');

// Mocking server
const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);
app.get('/verify', verifyToken, (req, res) => res.status(200).send('Token is valid'));

describe('Auth Controller', () => {
    describe('POST /register', () => {
        it('should register a new user', async () => {
            userModel.createUser.mockImplementation((username, password, callback) => {
                callback(null, 1);
            });

            const response = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    password: 'testpass'
                });

            expect(response.status).toBe(201);
            expect(response.text).toBe('User registered');
        });

        it('should handle errors during registration', async () => {
            userModel.createUser.mockImplementation((username, password, callback) => {
                callback(new Error('DB Error'), null);
            });

            const response = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    password: 'testpass'
                });

            expect(response.status).toBe(500);
            expect(response.text).toBe('Error registering new user');
        });
    });

    describe('POST /login', () => {
        it('should login user with valid credentials', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                password: bcrypt.hashSync('testpass', 10)
            };

            userModel.findUserByUsername.mockImplementation((username, callback) => {
                callback(null, mockUser);
            });

            JWTCreate.mockReturnValue('mocked-jwt-token');

            const response = await request(app)
                .post('/login')
                .send({
                    username: 'testuser',
                    password: 'testpass'
                });

            expect(response.status).toBe(200);
            expect(response.body.token).toBe('mocked-jwt-token');
        });

        it('should return 401 for invalid credentials', async () => {
            userModel.findUserByUsername.mockImplementation((username, callback) => {
                callback(null, null);
            });

            const response = await request(app)
                .post('/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpass'
                });

            expect(response.status).toBe(401);
            expect(response.text).toBe('Invalid username or password');
        });
    });

    describe('verifyToken Middleware', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                headers: {}
            };
            res = {
                status: jest.fn(() => res),
                send: jest.fn()
            };
            next = jest.fn();
        });

        it('should call next if token is valid', () => {
            req.headers['Authorization'] = 'Bearer valid-token';
            JWTVerify.mockImplementation(() => ({
                id: 1,
                username: 'testuser'
            }));

            verifyToken(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
        });

        it('should return 401 if no token is provided', () => {
            verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('Access denied. No token provided.');
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 400 if token is invalid', () => {
            req.headers['Authorization'] = 'Bearer invalid-token';
            JWTVerify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Invalid token');
            expect(next).not.toHaveBeenCalled();
        });
    });
});
