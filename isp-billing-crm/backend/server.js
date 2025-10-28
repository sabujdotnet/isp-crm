import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeNeonDB, db } from './config/database.js';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import billingRoutes from './routes/billing.js';
import mikrotikRoutes from './routes/mikrotik.js';
import invoiceRoutes from './routes/invoices.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
await initializeNeonDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/mikrotik', mikrotikRoutes);
app.use('/api/invoices', invoiceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ISP Billing API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});