import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { api } from '../config/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState({
    total_clients: 0,
    active_clients: 0,
    total_revenue: 0,
    pending_payments: 0
  });
  const [recentClients, setRecentClients] = useState([]);
  const [recentBilling, setRecentBilling] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, clientsData, billingData] = await Promise.all([
        api.getDashboardStats(),
        api.getClients({ limit: 5 }),
        api.getBilling({ limit: 5 })
      ]);

      setStats(statsData);
      setRecentClients(clientsData);
      setRecentBilling(billingData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { 
      title: 'Total Clients', 
      value: stats.total_clients, 
      icon: Users, 
      color: 'bg-blue-500',
      trend: '+12%'
    },
    { 
      title: 'Active Clients', 
      value: stats.active_clients, 
      icon: Activity, 
      color: 'bg-green-500',
      trend: '+5%'
    },
    { 
      title: 'Total Revenue', 
      value: `৳${Number(stats.total_revenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-purple-500',
      trend: '+18%'
    },
    { 
      title: 'Pending Payments', 
      value: stats.pending_payments, 
      icon: Clock, 
      color: 'bg-orange-500',
      trend: '-3%'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.trend}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Clients</h3>
          <div className="space-y-3">
            {recentClients.length > 0 ? recentClients.map(client => (
              <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <p className="font-medium text-gray-800">{client.name}</p>
                  <p className="text-sm text-gray-600">{client.package || 'No package'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {client.status}
                </span>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-8">No clients yet</p>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {recentBilling.length > 0 ? recentBilling.map(bill => (
              <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <p className="font-medium text-gray-800">{bill.client_name || 'Unknown'}</p>
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
            )) : (
              <p className="text-center text-gray-500 py-8">No billing records yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <h4 className="font-semibold text-yellow-800">Action Required</h4>
          <p className="text-sm text-yellow-700 mt-1">
            You have {stats.pending_payments} pending payments that need attention.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;