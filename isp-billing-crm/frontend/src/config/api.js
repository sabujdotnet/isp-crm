export const API_BASE_URL = import.meta.env.VITE_API_URL || 
                            process.env.REACT_APP_API_URL || 
                            'http://localhost:5000/api';

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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  },

  // Auth
  login: (credentials) => api.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  register: (userData) => api.request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Clients
  getClients: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/clients?${query}`);
  },

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

  // Billing
  getBilling: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/billing?${query}`);
  },

  saveBilling: (billingData) => api.request('/billing', {
    method: 'POST',
    body: JSON.stringify(billingData),
  }),

  getDashboardStats: () => api.request('/billing/stats/dashboard'),

  // MikroTik
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

  // Invoices
  getInvoices: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/invoices?${query}`);
  },

  createInvoice: (invoiceData) => api.request('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoiceData),
  }),

  updateInvoiceStatus: (id, statusData) => api.request(`/invoices/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(statusData),
  }),
};