import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, Wifi, FileText, BarChart3, 
  Settings, LogOut, Plus, Search, Filter, Download,
  Upload, Eye, Edit, Trash2, CheckCircle, XCircle,
  Clock, TrendingUp, Server, Activity
} from 'lucide-react';

import { api as API } from '../config/api';

// Main App Component
export default function ISPBillingCRM() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [billing, setBilling] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const savedUser = localStorage.getItem('isp_user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setCurrentUser(JSON.parse(savedUser));
      loadData();
    }
  }, []);

  const loadData = async () => {
    const clientsData = await API.getClients();
    const billingData = await API.getBilling();
    setClients(clientsData);
    setBilling(billingData);
  };

  // Login Component
  const LoginScreen = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const result = await API.login(credentials);
        if (result.token) {
          localStorage.setItem('token', result.token);
          setCurrentUser(result.user);
          localStorage.setItem('isp_user', JSON.stringify(result.user));
        }
      } catch (error) {
        console.error('Login failed:', error);
        alert(error.message || 'Login failed. Please try again.');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Wifi className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">ISP Billing CRM</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-600 mt-6">
            Demo: admin / admin
          </p>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const totalRevenue = billing.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
    const pendingPayments = billing.filter(b => b.status === 'due').length;

    const stats = [
      { title: 'Total Clients', value: totalClients, icon: Users, color: 'bg-blue-500' },
      { title: 'Active Clients', value: activeClients, icon: Activity, color: 'bg-green-500' },
      { title: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' },
      { title: 'Pending Payments', value: pendingPayments, icon: Clock, color: 'bg-orange-500' }
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Clients</h3>
            <div className="space-y-3">
              {clients.slice(0, 5).map(client => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.package}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {client.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Status</h3>
            <div className="space-y-3">
              {billing.slice(0, 5).map(bill => {
                const client = clients.find(c => c.id === bill.clientId);
                return (
                  <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{client?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">৳{bill.amount}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      bill.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      bill.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bill.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Clients Component
  const ClientsManager = () => {
    const [formData, setFormData] = useState({
      name: '', phone: '', email: '', address: '',
      package: '10Mbps-500', status: 'active', mikrotikUser: ''
    });

    const filteredClients = clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.phone?.includes(searchTerm);
      const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (selectedItem) {
          await API.updateClient(selectedItem.id, formData);
        } else {
          await API.createClient(formData);
        }
        await loadData();
        setShowModal(null);
        setSelectedItem(null);
        setFormData({ name: '', phone: '', email: '', address: '', package: '10Mbps-500', status: 'active', mikrotikUser: '' });
      } catch (error) {
        console.error('Failed to save client:', error);
        alert(error.message || 'Failed to save client. Please try again.');
      }
    };

    const handleEdit = (client) => {
      setSelectedItem(client);
      setFormData(client);
      setShowModal('client');
    };

    const handleDelete = async (id) => {
      if (confirm('Are you sure you want to delete this client?')) {
        await API.deleteClient(id);
        await loadData();
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Client Management</h2>
          <button
            onClick={() => setShowModal('client')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Client
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Package</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{client.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.package}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        client.status === 'active' ? 'bg-green-100 text-green-800' :
                        client.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(client)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(client.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal === 'client' && (
          <Modal onClose={() => { setShowModal(null); setSelectedItem(null); }}>
            <h3 className="text-xl font-bold mb-4">{selectedItem ? 'Edit' : 'Add'} Client</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Client Name *"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <textarea
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows="2"
              />
              <select
                value={formData.package}
                onChange={(e) => setFormData({...formData, package: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="10Mbps-500">10Mbps - ৳500</option>
                <option value="5Mbps-400">5Mbps - ৳400</option>
                <option value="15Mbps-600">15Mbps - ৳600</option>
                <option value="20Mbps-800">20Mbps - ৳800</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <input
                type="text"
                placeholder="MikroTik Username"
                value={formData.mikrotikUser}
                onChange={(e) => setFormData({...formData, mikrotikUser: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowModal(null)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    );
  };

  // Modal Component
  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );

  // Main Layout
  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Wifi className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">ISP CRM</h1>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'clients', icon: Users, label: 'Clients' },
              { id: 'billing', icon: DollarSign, label: 'Billing' },
              { id: 'invoices', icon: FileText, label: 'Invoices' },
              { id: 'mikrotik', icon: Server, label: 'MikroTik' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-6 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {currentUser.name[0]}
            </div>
            <div>
              <p className="font-medium text-gray-800">{currentUser.name}</p>
              <p className="text-sm text-gray-600">{currentUser.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('isp_user');
              setCurrentUser(null);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'clients' && <ClientsManager />}
        {activeTab === 'billing' && <div className="text-center text-gray-600">Billing module coming soon...</div>}
        {activeTab === 'invoices' && <div className="text-center text-gray-600">Invoice module coming soon...</div>}
        {activeTab === 'mikrotik' && <div className="text-center text-gray-600">MikroTik integration coming soon...</div>}
        {activeTab === 'settings' && <div className="text-center text-gray-600">Settings coming soon...</div>}
      </div>
    </div>
  );
}VITE_API_URL=https://isp-billing-crm.onrender.com
