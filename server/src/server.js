import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes    from './routes/authRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/auth',    authRoutes);
app.use('/api/meetings',meetingRoutes);

// health check
app.get('/api', (_, res) => res.json({ msg: 'Nexus Haven API v1' }));

// boot
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
});