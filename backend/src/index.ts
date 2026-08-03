import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import customersRouter from './routes/customers.js';
import recommendRouter from './routes/recommend.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Vercel frontend & local dev
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Healthcheck
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Insurance Cross-Sell Backend', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/customers', customersRouter);
app.use('/api/recommend', recommendRouter);
app.use('/api/dashboard', dashboardRouter);

app.listen(PORT, () => {
  console.log(`🚀 Backend Express Server running on http://localhost:${PORT}`);
});
