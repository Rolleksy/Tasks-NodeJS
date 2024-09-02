import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import JWTCreate from '../JWTManager/JWTCreate';
import JWTVerify from '../JWTManager/JWTVerify';
import userService from '../models/userModel';
import moment = require('moment');

// Secret key for JWT
const SECRET_KEY = process.env.SECRET || '';

class AuthController {
    public register = async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        userService.createUser(username, hashedPassword, (err, userId) => {
            if (err) {
                res.status(500).send('Error registering new user');
                return;
            }
            res.status(201).send('User registered');
        });
    };

    public login = (req: Request, res: Response): void => {
        const { username, password } = req.body;

        userService.findUserByUsername(username, (err, user) => {
            if (err || !user || !bcrypt.compareSync(password, user.password)) {
                res.status(401).send('Invalid username or password');
                return;
            }

            const payload = { 
                id: user.id, 
                username: user.username,
                exp: moment().add(1, "hour").unix()
            };
            const token = JWTCreate.createJwt({ alg: 'HS256', typ: 'JWT' }, payload, SECRET_KEY);
            res.status(200).json({ token });
        });
    };

    public verifyToken = (req: Request, res: Response, next: NextFunction): void => {
        const token = req.headers['authorization']?.replace(/^Bearer\s/, '');

        if (!token) {
            res.status(401).send('Access denied. No token provided.');
            return;
        }

        try {
            const decoded = JWTVerify.verifyJwt(token, SECRET_KEY);
            (req as any).user = decoded;
            next();
        } catch (error) {
            res.status(400).send('Invalid token');
        }
    };
}

export default AuthController;
