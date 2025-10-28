import React, { useState, useEffect } from 'react';
import { Plus, Download, Eye, Send, FileText } from 'lucide-react';
import { api } from '../config/api';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await api.getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = () => {
    alert('Invoice generation feature coming soon!');
  };

  const handleDownloadInvoice = (invoice) => {
    alert(`Downloading invoice: ${invoice.invoice_number}`);
  };

  const handleSendInvoice = (invoice) => {
    alert(`Sending invoice: ${invoice.invoice_number}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Invoice Management</h2>
          <p className="text-gray-600 mt-1">Create and manage client invoices</p>
        </div>
        <button
          onClick={handleGenerateInvoice}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Generate Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-800">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-600">
            {invoices.filter(i => i.status === 'paid').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-600">
            {invoices.filter(i => i.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600">
            {invoices.filter(i => i.status === 'overdue').length}
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No invoices yet. Generate your first invoice to get started.
                  </td>
                </tr>
              ) : (
                invoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {invoice.client_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      ৳{invoice.amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(invoice.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendInvoice(invoice)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Send"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Invoices;