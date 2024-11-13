import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import cameraRoutes from './routes/cameras';
import recordingRoutes from './routes/recordings';
import alertRoutes from './routes/alerts';
import { limiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import streamingRoutes from './streaming/server';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://webcams.windy.com'],
  credentials: true
}));
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use(mongoSanitize());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/recordings', recordingRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api', streamingRoutes);

// Add after all routes
app.use(errorHandler);

// Database connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 