import { useState } from 'react';
import { Save, RefreshCw, Database, Globe, Printer, Smartphone } from 'lucide-react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    pharmacyName: 'Sathya Pharmacy',
    address: '123 Main Street, City, State 12345',
    phone: '+91 9876543210',
    email: 'admin@sathyapharmacy.com',
    gstNumber: '29ABCDE1234F1Z5',
    licenseNumber: 'DL-12345',
    
    // Business Settings
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    
    // Inventory Settings
    lowStockThreshold: 10,
    autoReorderEnabled: true,
    expiryAlertDays: 30,
    
    // Billing Settings
    invoicePrefix: 'INV',
    invoiceStartNumber: 1,
    taxCalculationMethod: 'inclusive',
    defaultPaymentMethod: 'cash',
    
    // System Settings
    autoBackup: true,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    maxLoginAttempts: 3
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving system settings:', settings);
    // Here you would typically save to backend
  };

  const handleResetSettings = () => {
    console.log('Resetting to default settings');
    // Reset to default values
  };

  return (
    <div className="system-settings">
      <div className="settings-header">
        <div className="header-info">
          <h2>System Configuration</h2>
          <p>Configure general system settings and business information</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleResetSettings}>
            <RefreshCw size={16} />
            Reset to Defaults
          </button>
          <button className="btn btn-primary" onClick={handleSaveSettings}>
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="settings-content">
        {/* Pharmacy Information */}
        <div className="settings-section">
          <h3>Pharmacy Information</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Pharmacy Name</label>
              <input
                type="text"
                value={settings.pharmacyName}
                onChange={(e) => handleSettingChange('pharmacyName', e.target.value)}
                className="setting-input"
              />
            </div>
            <div className="setting-item">
              <label>Address</label>
              <textarea
                value={settings.address}
                onChange={(e) => handleSettingChange('address', e.target.value)}
                className="setting-textarea"
                rows="3"
              />
            </div>
            <div className="setting-item">
              <label>Phone Number</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleSettingChange('phone', e.target.value)}
                className="setting-input"
              />
            </div>
            <div className="setting-item">
              <label>Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
                className="setting-input"
              />
            </div>
            <div className="setting-item">
              <label>GST Number</label>
              <input
                type="text"
                value={settings.gstNumber}
                onChange={(e) => handleSettingChange('gstNumber', e.target.value)}
                className="setting-input"
              />
            </div>
            <div className="setting-item">
              <label>Drug License Number</label>
              <input
                type="text"
                value={settings.licenseNumber}
                onChange={(e) => handleSettingChange('licenseNumber', e.target.value)}
                className="setting-input"
              />
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="settings-section">
          <h3>Regional & Format Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                className="setting-select"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="setting-select"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Date Format</label>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                className="setting-select"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Time Format</label>
              <select
                value={settings.timeFormat}
                onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                className="setting-select"
              >
                <option value="24">24 Hour</option>
                <option value="12">12 Hour (AM/PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="settings-section">
          <h3>Business Configuration</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Low Stock Alert Threshold</label>
              <input
                type="number"
                value={settings.lowStockThreshold}
                onChange={(e) => handleSettingChange('lowStockThreshold', parseInt(e.target.value))}
                className="setting-input"
                min="1"
              />
            </div>
            <div className="setting-item">
              <label>Expiry Alert Days</label>
              <input
                type="number"
                value={settings.expiryAlertDays}
                onChange={(e) => handleSettingChange('expiryAlertDays', parseInt(e.target.value))}
                className="setting-input"
                min="1"
              />
            </div>
            <div className="setting-item">
              <label>Invoice Prefix</label>
              <input
                type="text"
                value={settings.invoicePrefix}
                onChange={(e) => handleSettingChange('invoicePrefix', e.target.value)}
                className="setting-input"
              />
            </div>
            <div className="setting-item">
              <label>Invoice Start Number</label>
              <input
                type="number"
                value={settings.invoiceStartNumber}
                onChange={(e) => handleSettingChange('invoiceStartNumber', parseInt(e.target.value))}
                className="setting-input"
                min="1"
              />
            </div>
            <div className="setting-item">
              <label>Tax Calculation</label>
              <select
                value={settings.taxCalculationMethod}
                onChange={(e) => handleSettingChange('taxCalculationMethod', e.target.value)}
                className="setting-select"
              >
                <option value="inclusive">Tax Inclusive</option>
                <option value="exclusive">Tax Exclusive</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Default Payment Method</label>
              <select
                value={settings.defaultPaymentMethod}
                onChange={(e) => handleSettingChange('defaultPaymentMethod', e.target.value)}
                className="setting-select"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="credit">Credit</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="settings-section">
          <h3>System Preferences</h3>
          <div className="settings-toggles">
            <div className="toggle-item">
              <div className="toggle-info">
                <label>Auto Reorder</label>
                <p>Automatically create purchase orders when stock is low</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoReorderEnabled}
                  onChange={(e) => handleSettingChange('autoReorderEnabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div className="toggle-info">
                <label>Auto Backup</label>
                <p>Automatically backup data at scheduled intervals</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
