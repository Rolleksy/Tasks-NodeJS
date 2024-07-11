const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const JWTCreate = require('./JWTManager/JWTCreate');
const JWTVerify = require('./JWTManager/JWTVerify');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('./userDb.sqlite');
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword, function (err) {
        if (err) {
            return res.status(500).send('Error registering new user');
        }
        res.status(201).send('User registered');
    });
    stmt.finalize();
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.status(500).send('Error logging in');
        }
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send('Invalid username or password');
        }

        const payload = { id: user.id, username: user.username };
        const token = JWTCreate({ alg: 'HS256', typ: 'JWT' }, payload, SECRET_KEY);

        res.status(200).json({ token });
    });
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

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

app.get('/secret', verifyToken, (req, res) => {
    res.status(200).send('Secret content');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
