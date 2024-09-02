import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoute';
import partsRoutes from './routes/partRoute';
import ordersRoutes from './routes/orderRoute';

dotenv.config();

// CORS OPTIONS
const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.use(bodyParser.json());
app.use(cors(corsOptions));

// DEFINING ROUTES
app.use('/auth', authRoutes);
app.use('/api', partsRoutes); 
app.use('/api', ordersRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default server;
