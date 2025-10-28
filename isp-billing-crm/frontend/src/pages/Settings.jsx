import React, { useState } from 'react';
import { Save, Database, Bell, Shield, Mail } from 'lucide-react';

function Settings() {
  const [settings, setSettings] = useState({
    companyName: 'ISP Company Name',
    companyEmail: 'admin@isp.com',
    companyPhone: '+880 1234567890',
    companyAddress: 'Dhaka, Bangladesh',
    mikrotikHost: '192.168.88.1',
    mikrotikUser: 'admin',
    mikrotikPassword: '',
    smsNotifications: true,
    emailNotifications: false,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('isp_settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your application settings and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Company Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.companyEmail}
                onChange={(e) => setSettings({...settings, companyEmail: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.companyPhone}
                onChange={(e) => setSettings({...settings, companyPhone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={settings.companyAddress}
                onChange={(e) => setSettings({...settings, companyAddress: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* MikroTik Configuration */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">MikroTik Configuration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Router IP
              </label>
              <input
                type="text"
                value={settings.mikrotikHost}
                onChange={(e) => setSettings({...settings, mikrotikHost: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="192.168.88.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={settings.mikrotikUser}
                onChange={(e) => setSettings({...settings, mikrotikUser: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={settings.mikrotikPassword}
                onChange={(e) => setSettings({...settings, mikrotikPassword: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">Enable SMS notifications for due payments</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">Enable email notifications</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">Enable automatic backups</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;