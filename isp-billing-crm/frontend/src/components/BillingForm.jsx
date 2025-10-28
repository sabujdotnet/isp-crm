import React, { useState, useEffect } from 'react';

function BillingForm({ billing, clients, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    clientId: billing?.client_id || '',
    amount: billing?.amount || 0,
    amountPaid: billing?.amount_paid || 0,
    bkashPayment: billing?.bkash_payment || 0,
    paymentMethod: billing?.payment_method || 'cash',
    paymentDate: billing?.payment_date || new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (formData.clientId && !billing) {
      const client = clients.find(c => c.id === parseInt(formData.clientId));
      if (client && client.monthly_fee) {
        setFormData(prev => ({ ...prev, amount: client.monthly_fee }));
      }
    }
  }, [formData.clientId, clients, billing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client *
        </label>
        <select
          value={formData.clientId}
          onChange={(e) => setFormData({...formData, clientId: parseInt(e.target.value)})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
          disabled={!!billing}
        >
          <option value="">Select Client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name} - {client.package}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monthly Bill (৳) *
        </label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cash Payment (৳)
          </label>
          <input
            type="number"
            value={formData.amountPaid}
            onChange={(e) => setFormData({...formData, amountPaid: parseFloat(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            bKash Payment (৳)
          </label>
          <input
            type="number"
            value={formData.bkashPayment}
            onChange={(e) => setFormData({...formData, bkashPayment: parseFloat(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="cash">Cash</option>
            <option value="bkash">bKash</option>
            <option value="bank">Bank Transfer</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Date *
          </label>
          <input
            type="date"
            value={formData.paymentDate}
            onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          Total Paid: ৳{(formData.amountPaid + formData.bkashPayment).toFixed(2)} | 
          Due: ৳{Math.max(0, formData.amount - formData.amountPaid - formData.bkashPayment).toFixed(2)}
        </p>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Payment
        </button>
      </div>
    </form>
  );
}

export default BillingForm;