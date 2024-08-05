const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const partsRoutes = require('./routes/parts');
const ordersRoutes = require('./routes/order');
const authController = require('./controllers/authController');
const usersDb = require('./database');

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST','PUT' ,'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};


const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/api', partsRoutes);
app.use('/api', ordersRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
