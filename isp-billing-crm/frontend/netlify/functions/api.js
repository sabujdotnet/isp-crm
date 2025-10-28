import express from 'express';
import serverless from 'serverless-http';
import { initializeNeonDB } from '../../backend/config/database.js';
import authRoutes from '../../backend/routes/auth.js';
import clientRoutes from '../../backend/routes/clients.js';
import billingRoutes from '../../backend/routes/billing.js';

const app = express();
app.use(express.json());

// Initialize DB
await initializeNeonDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/billing', billingRoutes);

export const handler = serverless(app);