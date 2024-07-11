# JWT creation and verification with custom functions.

This project is designed for studying and implementing custom JWT functionality. It enables users to create a simple API with endpoints tailored for testing JWT capabilities:

    POST /register: Endpoint for user registration, allowing clients to create new user accounts with a username and password securely hashed and stored.

    POST /login: Endpoint for user authentication, where clients can verify their credentials (username and password) and receive a JWT (JSON Web Token) upon successful login.

    GET /secret: Endpoint designed to test JWT authorization. Access to this endpoint requires clients to present a valid JWT in the 'Authorization' header. If authenticated, it returns protected content.

## Installing packages

`npm i express sqlite3 bcrypt body-parser cors dotenv`

- **Express** - In the provided example, Express is used as the web server framework. It handles routing (app.post, app.get) for endpoints like /register, /login, and /secret. Express also integrates middleware such as body-parser and cors, which parse incoming requests and handle Cross-Origin Resource Sharing (CORS) policies.

- **SQLite3** - SQLite3 is used as the database management system. It creates a SQLite database file (userDb.sqlite) and defines a users table with columns for id, username, and password. It's used in CRUD operations for user registration (/register) and user authentication (/login).

- **bcrypt** - bcrypt is employed for securely hashing user passwords before storing them in the database during registration (/register). It's also used for comparing hashed passwords during login (/login) to validate user credentials securely.

- **body-parser** - body-parser is utilized to parse JSON data from incoming HTTP requests (req.body). In the example, it parses the JSON payload containing username and password during user registration (/register) and user login (/login).

- **cors** - cors middleware is configured with specific options (corsOptions) to handle Cross-Origin Resource Sharing (CORS). It allows the frontend application (e.g., React app running on http://localhost:3000) to make requests to the backend server (running on http://localhost:3001) without violating browser security policies.

- **dotenv** - dotenv is used to load environment variables, such as SECRET_KEY, from a .env file. In the example, SECRET_KEY is used for signing and verifying JWT tokens in JWTCreate and JWTVerify functions respectively, ensuring secure authentication and authorization processes.

## Creating `JWTCreate.js` and `JWTVerify.js`

Both of those functions use function `base64UrlEncode(str)` for encoding given `str` to url safe buffer, then replaces `=` with blank, `+` with `-` and finally `/` to `_`.

1. `createJWT(header, payload, secret)` Function

```js
function createJwt(header, payload, secret) {
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signature = crypto.createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}
```

1.1. Input parameters

- `header` : JWT header,
- `payload` : JWT payload,
- `secret` : Secret value usedto generate JWT signature

1.2. Logic

Using `base64UrlEncode` to encode both `header` and `payload`.
Then creating `signature` based on `secret` value, using `crypto.createHmac`

1.3. Returned values

This function returns JWT Token created from inputed parameters.

2. `verifyJWT(token, secret)` Function

```js
function verifyJwt(token, secret) {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    const expectedSignature = crypto.createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
    }

    const decodedPayload = JSON.parse(base64UrlDecode(encodedPayload));

    return decodedPayload;
}
```

1.1. Input parameters

- `token`
- `secret`

1.2. Logic

Firstly split `token` into three values `encodedHeader, encodedPayload, signature`.
Using `secret` value to create `expectedSignature` which will be then compared to `signature` received from spliting the token. 

## Creating `.env` file

Add `.env` file to folder and store value `SECRET_KEY=your_secret_value` inside it.
This file is used to store secret value used for JWT creator


## Creating server

`server.js` is used to establish database and endpoints for `register` and `login`

1. Adding dependecies

```js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const JWTCreate = require('./JWTManager/JWTCreate');
const JWTVerify = require('./JWTManager/JWTVerify');
```

2. Preparing `server.js` for database connection

```js
const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY; // Loading value from .env file

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('./userDb.sqlite');
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
});
```

3. Creating endpoints

3.1. Register endpoint

```js
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10); // Need to use abstraction instead?

    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword, function (err) {
        if (err) {
            return res.status(500).send('Error registering new user');
        }
        res.status(201).send('User registered');
    });
    stmt.finalize();
});
```

3.2. Login endpoint

```js
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
```

3.3. Secret endpoint

This endpoint is created to test user authorization with created JWT. That way unauthorized user cannot receive contents of `/secret` endpoint.

```js
app.get('/secret', verifyToken, (req, res) => {
    res.status(200).send('Secret content');
});
```

`verifyToken` is a function that verifies if token received in header `authorization` is the same as expected token, if so it grants access to endpoint, otherwise it returns 401 with access denied.

```js
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
```

## Usage

1. Install necessary packages from NPM.
2. Create `.env` file in base folder with `SECRET_KEY`.
3. Run command `node server.js` to start the server.
4. Using Postman or any similar software send POST to `/register` endpoint with body consisting `username` and `password`
```json
{
    "username": "user",
    "password": "password"
}
```
5. Send POST to `/login` with the same json body to receive token value.
6. Send GET `/secret` with header `authorization` and its value must be set as previously returned token value.