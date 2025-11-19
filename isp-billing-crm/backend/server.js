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
// CORS configuration - Allow your frontend domains
const corsOptions = {
  origin: [
    'http://localhost:5173',                    // Local development
    'https://isp-crm-28h5.onrender.com',             // Replace with your Netlify URL
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

//app.use(cors());
app.use(express.json());

// Initialize Database
await initializeNeonDB();

// ===== ROOT ROUTE ==== 
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ISP Billing API Server', 
    version: '1.0.0', 
    endpoints: { 
      health: '/api/health', 
      auth: '/api/auth', 
      clients: '/api/clients', 
      billing: '/api/billing', 
      invoices: '/api/invoices', 
      mikrotik: '/api/mikrotik' 
    }
  }); 
});

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

// 404 handler - FIXED THIS SECTION
app.use((req, res) => { 
  res.status(404).json({ 
    error: 'Not Found', 
    message: `Cannot ${req.method} ${req.path}`,  // Fixed: Added backticks
    availableEndpoints: [
      '/api/health',
      '/api/auth', 
      '/api/clients', 
      '/api/billing', 
      '/api/invoices', 
      '/api/mikrotik'
    ]
  });
}); 

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
