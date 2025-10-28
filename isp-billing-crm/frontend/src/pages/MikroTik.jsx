import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Server, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { api } from '../config/api';
import Modal from '../components/Modal';

function MikroTik() {
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    profile: 'default',
    service: 'pppoe'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, clientsData] = await Promise.all([
        api.getMikrotikUsers().catch(() => []),
        api.getClients()
      ]);
      setUsers(usersData);
      setClients(clientsData);
    } catch (error) {
      console.error('Failed to load MikroTik data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.createMikrotikUser(formData);
      await loadData();
      setShowModal(false);
      setFormData({ username: '', password: '', profile: 'default', service: 'pppoe' });
      alert('PPPoE user created successfully!');
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create PPPoE user: ' + error.message);
    }
  };

  const handleDisableUser = async (username) => {
    try {
      await api.updateMikrotikUser(username, { disabled: true });
      await loadData();
      alert('User disabled successfully!');
    } catch (error) {
      console.error('Failed to disable user:', error);
      alert('Failed to disable user');
    }
  };

  const handleDeleteUser = async (username) => {
    if (!confirm(`Are you sure you want to delete user: ${username}?`)) return;

    try {
      await api.deleteMikrotikUser(username);
      await loadData();
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
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
          <h2 className="text-2xl font-bold text-gray-800">MikroTik Management</h2>
          <p className="text-gray-600 mt-1">Manage PPPoE users and router connections</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create User
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3">
          <Server className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-800">Router Connection</h3>
            <p className="text-sm text-gray-600">MikroTik RouterOS</p>
          </div>
          <div className="ml-auto">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* PPPoE Users Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          PPPoE Users ({users.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Profile</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No PPPoE users found. Create one to get started.
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {user.name || user.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.profile || 'default'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.service || 'pppoe'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.disabled === 'yes' || user.disabled === true
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.disabled === 'yes' || user.disabled === true ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDisableUser(user.name || user.username)}
                          className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                          title="Disable"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.name || user.username)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Sync with Clients */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2">Client Integration</h3>
        <p className="text-sm text-blue-700 mb-4">
          Sync client accounts with MikroTik PPPoE users for seamless management.
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Auto-Create PPPoE Users
          </button>
          <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm">
            Sync Status
          </button>
        </div>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <Modal
          title="Create PPPoE User"
          onClose={() => {
            setShowModal(false);
            setFormData({ username: '', password: '', profile: 'default', service: 'pppoe' });
          }}
        >
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Client (Optional)
              </label>
              <select
                onChange={(e) => {
                  const client = clients.find(c => c.id === parseInt(e.target.value));
                  if (client) {
                    setFormData({
                      ...formData,
                      username: client.mikrotik_username || client.name.toLowerCase().replace(/\s+/g, '')
                    });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a client...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.package}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="pppoe_username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter password"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile
                </label>
                <input
                  type="text"
                  value={formData.profile}
                  onChange={(e) => setFormData({...formData, profile: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="default"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pppoe">PPPoE</option>
                  <option value="pptp">PPTP</option>
                  <option value="l2tp">L2TP</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create User
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default MikroTik;