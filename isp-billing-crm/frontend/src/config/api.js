// ===== frontend/src/config/api.js =====
// Complete API configuration file

export const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || 
                            'https://isp-billing-crm.onrender.com/api';

// API helper with error handling
export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // ===== Auth Endpoints =====
  login: (credentials) => api.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  register: (userData) => api.request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // ===== Client Endpoints =====
  getClients: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/clients${query ? '?' + query : ''}`);
  },

  getClient: (id) => api.request(`/clients/${id}`),

  createClient: (clientData) => api.request('/clients', {
    method: 'POST',
    body: JSON.stringify(clientData),
  }),

  updateClient: (id, clientData) => api.request(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  }),

  deleteClient: (id) => api.request(`/clients/${id}`, {
    method: 'DELETE',
  }),

  // ===== Billing Endpoints =====
  getBilling: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/billing${query ? '?' + query : ''}`);
  },

  saveBilling: (billingData) => api.request('/billing', {
    method: 'POST',
    body: JSON.stringify(billingData),
  }),

  getDashboardStats: () => api.request('/billing/stats/dashboard'),

  // ===== Invoice Endpoints =====
  getInvoices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/invoices${query ? '?' + query : ''}`);
  },

  getInvoice: (id) => api.request(`/invoices/${id}`),

  createInvoice: (invoiceData) => api.request('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoiceData),
  }),

  updateInvoiceStatus: (id, statusData) => api.request(`/invoices/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(statusData),
  }),

  // ===== MikroTik Endpoints =====
  getMikrotikUsers: () => api.request('/mikrotik/users'),

  createMikrotikUser: (userData) => api.request('/mikrotik/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  updateMikrotikUser: (username, userData) => api.request(`/mikrotik/users/${username}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  deleteMikrotikUser: (username) => api.request(`/mikrotik/users/${username}`, {
    method: 'DELETE',
  }),
};

// ===== frontend/.env =====
// For local development
/*
VITE_API_URL=https://isp-billing-crm.onrender.com/api
*/

// ===== frontend/.env.production =====
// For production build
/*
VITE_API_URL=https://isp-billing-crm.onrender.com/api
*/

// ===== frontend/netlify.toml =====
// Updated Netlify configuration
/*
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  VITE_API_URL = "https://isp-billing-crm.onrender.com/api"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Add CORS headers for API calls
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
*/

// ===== backend/server.js - Update CORS Configuration =====
// Add this to your backend server.js file

/*
import cors from 'cors';

// CORS configuration - Allow your frontend domains
const corsOptions = {
  origin: [
    'http://localhost:5173',                    // Local development
    'https://your-app.netlify.app',             // Replace with your Netlify URL
    'https://isp-billing-crm.netlify.app'       // Example
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Or for development, allow all origins (NOT recommended for production)
// app.use(cors());
*/

// ===== Test API Connection =====
// Add this component to test the connection

/*
import React, { useEffect, useState } from 'react';
import { api } from '../config/api';

function TestConnection() {
  const [status, setStatus] = useState('testing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test health endpoint
      const response = await fetch('https://isp-billing-crm.onrender.com/api/health');
      const data = await response.json();
      
      if (data.status === 'OK') {
        setStatus('success');
        setMessage('✅ Backend connected successfully!');
      } else {
        setStatus('error');
        setMessage('❌ Backend responded but with error');
      }
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Connection failed: ${error.message}`);
    }
  };

  return (
    <div className={`p-4 rounded-lg ${
      status === 'success' ? 'bg-green-50 text-green-800' :
      status === 'error' ? 'bg-red-50 text-red-800' :
      'bg-yellow-50 text-yellow-800'
    }`}>
      {message || 'Testing connection...'}
    </div>
  );
}

export default TestConnection;
*/

// ===== Quick Test Script =====
// Run this in browser console to test API

/*
// Test Health Endpoint
fetch('https://isp-billing-crm.onrender.com/api/health')
  .then(res => res.json())
  .then(data => console.log('Health Check:', data))
  .catch(err => console.error('Error:', err));

// Test Login
fetch('https://isp-billing-crm.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
})
  .then(res => res.json())
  .then(data => console.log('Login Response:', data))
  .catch(err => console.error('Error:', err));
*/

// ===== Troubleshooting Common Issues =====

/*
1. CORS Error:
   - Update backend CORS to allow your Netlify domain
   - Check browser console for specific CORS error

2. Network Error / Failed to Fetch:
   - Verify backend is running: https://isp-billing-crm.onrender.com/api/health
   - Check if Render.com service is active (free tier may sleep)
   - Wait 30 seconds for cold start

3. 404 Not Found:
   - Verify API endpoint paths match backend routes
   - Check API_BASE_URL doesn't have trailing slash

4. 401 Unauthorized:
   - Token expired or invalid
   - Clear localStorage and login again

5. 500 Internal Server Error:
   - Check backend logs in Render.com dashboard
   - Verify environment variables are set
   - Database connection issue
*/

// ===== Environment Variables Checklist =====

/*
BACKEND (Render.com):
✓ DATABASE_URL
✓ JWT_SECRET
✓ MIKROTIK_HOST
✓ MIKROTIK_USER
✓ MIKROTIK_PASSWORD
✓ NODE_ENV=production

FRONTEND (Netlify):
✓ VITE_API_URL=https://isp-billing-crm.onrender.com/api
*/

// ===== Deployment Steps =====

/*
1. Update frontend .env.production:
   VITE_API_URL=https://isp-billing-crm.onrender.com/api

2. Update backend CORS in server.js:
   origin: ['https://your-frontend.netlify.app']

3. Commit and push changes:
   git add .
   git commit -m "Link frontend to backend API"
   git push

4. Netlify will auto-deploy

5. Test the connection at your-frontend.netlify.app

6. If backend sleeps (free tier), first request takes 30s
*/

// ===== Performance Tips =====

/*
1. Keep Backend Awake (Free Tier):
   - Use Cron-Job.org to ping every 14 minutes
   - Endpoint: https://isp-billing-crm.onrender.com/api/health

2. Add Loading States:
   - Show spinner during API calls
   - Display "Waking up server..." message for cold starts

3. Cache API Responses:
   - Store frequently used data in state/localStorage
   - Implement optimistic updates

4. Error Handling:
   - Retry failed requests
   - Show user-friendly error messages
   - Add offline detection
*/

export default api;
