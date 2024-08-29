const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// ROUTES
const authRoutes = require('./routes/auth');
const partsRoutes = require('./routes/parts');
const ordersRoutes = require('./routes/order');
// const authController = require('./controllers/authController');
// const usersDb = require('./database');

// CORS OPTIONS
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST','PUT' ,'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};


const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors(corsOptions));


// DEFINING ROUTES
app.use('/auth', authRoutes);
app.use('/api', partsRoutes);
app.use('/api', ordersRoutes);

// if imported with require, don't start the server - for testing purposes - wut even
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;

