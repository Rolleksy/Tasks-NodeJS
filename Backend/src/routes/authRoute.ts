import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();
const authControllers = new authController();

// Register route
router.post('/register', authControllers.register);

// Login route
router.post('/login', authControllers.login);

export default router;
