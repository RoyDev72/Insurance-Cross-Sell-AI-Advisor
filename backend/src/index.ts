import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import customersRouter from './routes/customers.js';
import recommendRouter from './routes/recommend.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend on port 3000
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
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
