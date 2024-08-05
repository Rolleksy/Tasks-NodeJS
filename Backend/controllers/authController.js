const bcrypt = require('bcrypt');
const JWTCreate = require('../JWTManager/JWTCreate');
const JWTVerify = require('../JWTManager/JWTVerify');
const userModel = require('../models/userModel');
const moment = require('moment');
const SECRET_KEY = process.env.SECRET;

const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    userModel.createUser(username, hashedPassword, (err, userId) => {
        if (err) {
            return res.status(500).send('Error registering new user');
        }
        res.status(201).send('User registered');
    });
};

const login = (req, res) => {
    const { username, password } = req.body;

    userModel.findUserByUsername(username, (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send('Invalid username or password');
        }

        const payload = { 
            id: user.id, 
            username: user.username,
            // Token will expire in 1 hour - fix?
            exp: moment().add(10, "second").unix()
        };
        const token = JWTCreate({ alg: 'HS256', typ: 'JWT' }, payload, SECRET_KEY);
        res.status(200).json({ token });
    });
};

const verifyToken = (req, res, next) => {
    const token = req.headers['Authorization'];

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = JWTVerify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).send('Invalid token');
    }
};

module.exports = {
    register,
    login,
    verifyToken
};
