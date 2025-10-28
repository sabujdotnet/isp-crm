import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Calendar } from 'lucide-react';
import { api } from '../config/api';
import Modal from '../components/Modal';
import BillingForm from '../components/BillingForm';

function Billing() {
  const [billing, setBilling] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredBilling, setFilteredBilling] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    filterBilling();
  }, [billing, searchTerm, statusFilter]);

  const loadData = async () => {
    try {
      const [billingData, clientsData] = await Promise.all([
        api.getBilling({ month: selectedMonth, year: selectedYear }),
        api.getClients()
      ]);
      setBilling(billingData);
      setClients(clientsData);
    } catch (error) {
      console.error('Failed to load billing:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBilling = () => {
    let filtered = billing;

    if (searchTerm) {
      filtered = filtered.filter(bill =>
        bill.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(bill => bill.status === statusFilter);
    }

    setFilteredBilling(filtered);
  };

  const handleSave = async (billingData) => {
    try {
      await api.saveBilling({
        ...billingData,
        month: selectedMonth,
        year: selectedYear
      });
      await loadData();
      setShowModal(false);
      setSelectedBilling(null);
    } catch (error) {
      console.error('Failed to save billing:', error);
      alert('Failed to save billing record');
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Billing Management</h2>
        <button
          onClick={() => {
            setSelectedBilling(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Payment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="due">Due</option>
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month, idx) => (
              <option key={idx} value={idx + 1}>{month}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredBilling.length} of {billing.length} records
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Paid</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">bKash</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBilling.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No billing records for this period
                  </td>
                </tr>
              ) : (
                filteredBilling.map(bill => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {bill.client_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">৳{bill.amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">৳{bill.amount_paid || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">৳{bill.amount_due || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">৳{bill.bkash_payment || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                        bill.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedBilling(bill);
                          setShowModal(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal
          title={selectedBilling ? 'Edit Payment' : 'Add Payment'}
          onClose={() => {
            setShowModal(false);
            setSelectedBilling(null);
          }}
        >
          <BillingForm
            billing={selectedBilling}
            clients={clients}
            onSave={handleSave}
            onCancel={() => {
              setShowModal(false);
              setSelectedBilling(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default Billing;