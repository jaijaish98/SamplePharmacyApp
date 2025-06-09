import { useState } from 'react';
import { Bell, Mail, Smartphone, AlertTriangle, Clock, DollarSign } from 'lucide-react';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    // Email Notifications
    emailEnabled: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: true,
    lowStockAlerts: true,
    expiryAlerts: true,
    salesTargetAlerts: true,
    systemAlerts: true,
    
    // SMS Notifications
    smsEnabled: false,
    smsLowStock: false,
    smsSystemDown: true,
    smsSecurityAlerts: true,
    
    // In-App Notifications
    inAppEnabled: true,
    browserNotifications: true,
    soundEnabled: true,
    
    // Alert Thresholds
    lowStockThreshold: 10,
    expiryDays: 30,
    salesTargetThreshold: 80,
    
    // Email Recipients
    adminEmails: ['admin@sathyapharmacy.com', 'dr.sathya@sathyapharmacy.com'],
    accountantEmails: ['accounts@sathyapharmacy.com'],
    managerEmails: ['manager@sathyapharmacy.com']
  });

  const [emailTemplates] = useState([
    {
      id: 'daily_report',
      name: 'Daily Sales Report',
      subject: 'Daily Sales Summary - {{date}}',
      frequency: 'Daily at 9:00 PM',
      recipients: 'Admin, Manager',
      status: 'Active'
    },
    {
      id: 'low_stock',
      name: 'Low Stock Alert',
      subject: 'Low Stock Alert - {{medicine_name}}',
      frequency: 'Immediate',
      recipients: 'Admin, Manager',
      status: 'Active'
    },
    {
      id: 'expiry_alert',
      name: 'Medicine Expiry Alert',
      subject: 'Medicines Expiring Soon',
      frequency: 'Weekly',
      recipients: 'Admin, Pharmacist',
      status: 'Active'
    },
    {
      id: 'monthly_summary',
      name: 'Monthly Business Summary',
      subject: 'Monthly Performance Report - {{month}}',
      frequency: 'Monthly',
      recipients: 'Admin, Accountant',
      status: 'Active'
    }
  ]);

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving notification settings:', notifications);
  };

  const handleTestEmail = (templateId) => {
    console.log(`Sending test email for template: ${templateId}`);
  };

  const handleAddEmail = (category) => {
    const email = prompt(`Enter email address for ${category}:`);
    if (email && email.includes('@')) {
      setNotifications(prev => ({
        ...prev,
        [`${category}Emails`]: [...prev[`${category}Emails`], email]
      }));
    }
  };

  const handleRemoveEmail = (category, email) => {
    setNotifications(prev => ({
      ...prev,
      [`${category}Emails`]: prev[`${category}Emails`].filter(e => e !== email)
    }));
  };

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <div className="header-info">
          <h2>Notification & Alert Settings</h2>
          <p>Configure email alerts, notifications, and communication preferences</p>
        </div>
        <button className="btn btn-primary" onClick={handleSaveSettings}>
          <Bell size={16} />
          Save Notification Settings
        </button>
      </div>

      <div className="settings-content">
        {/* Email Notifications */}
        <div className="settings-section">
          <div className="section-header">
            <Mail size={20} />
            <h3>Email Notifications</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.emailEnabled}
                onChange={(e) => handleNotificationChange('emailEnabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          {notifications.emailEnabled && (
            <div className="notification-options">
              <div className="option-item">
                <div className="option-info">
                  <label>Daily Sales Reports</label>
                  <p>Receive daily sales summary at end of business day</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.dailyReports}
                    onChange={(e) => handleNotificationChange('dailyReports', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="option-item">
                <div className="option-info">
                  <label>Weekly Reports</label>
                  <p>Weekly business performance summary</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.weeklyReports}
                    onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="option-item">
                <div className="option-info">
                  <label>Monthly Reports</label>
                  <p>Comprehensive monthly business analysis</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.monthlyReports}
                    onChange={(e) => handleNotificationChange('monthlyReports', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="option-item">
                <div className="option-info">
                  <label>Low Stock Alerts</label>
                  <p>Immediate alerts when inventory falls below threshold</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.lowStockAlerts}
                    onChange={(e) => handleNotificationChange('lowStockAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="option-item">
                <div className="option-info">
                  <label>Expiry Alerts</label>
                  <p>Notifications for medicines nearing expiry</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.expiryAlerts}
                    onChange={(e) => handleNotificationChange('expiryAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="option-item">
                <div className="option-info">
                  <label>Sales Target Alerts</label>
                  <p>Notifications for sales target achievements</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.salesTargetAlerts}
                    onChange={(e) => handleNotificationChange('salesTargetAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* SMS Notifications */}
        <div className="settings-section">
          <div className="section-header">
            <Smartphone size={20} />
            <h3>SMS Notifications</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.smsEnabled}
                onChange={(e) => handleNotificationChange('smsEnabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          {notifications.smsEnabled && (
            <div className="notification-options">
              <div className="option-item">
                <div className="option-info">
                  <label>Critical Low Stock</label>
                  <p>SMS alerts for critically low inventory</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.smsLowStock}
                    onChange={(e) => handleNotificationChange('smsLowStock', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="option-item">
                <div className="option-info">
                  <label>System Downtime</label>
                  <p>SMS notifications for system issues</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.smsSystemDown}
                    onChange={(e) => handleNotificationChange('smsSystemDown', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="option-item">
                <div className="option-info">
                  <label>Security Alerts</label>
                  <p>SMS for security breaches and suspicious activity</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.smsSecurityAlerts}
                    onChange={(e) => handleNotificationChange('smsSecurityAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Alert Thresholds */}
        <div className="settings-section">
          <div className="section-header">
            <AlertTriangle size={20} />
            <h3>Alert Thresholds</h3>
          </div>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Low Stock Threshold</label>
              <input
                type="number"
                value={notifications.lowStockThreshold}
                onChange={(e) => handleNotificationChange('lowStockThreshold', parseInt(e.target.value))}
                className="setting-input"
                min="1"
              />
              <span className="setting-unit">units</span>
            </div>
            <div className="setting-item">
              <label>Expiry Alert Days</label>
              <input
                type="number"
                value={notifications.expiryDays}
                onChange={(e) => handleNotificationChange('expiryDays', parseInt(e.target.value))}
                className="setting-input"
                min="1"
              />
              <span className="setting-unit">days before expiry</span>
            </div>
            <div className="setting-item">
              <label>Sales Target Alert</label>
              <input
                type="number"
                value={notifications.salesTargetThreshold}
                onChange={(e) => handleNotificationChange('salesTargetThreshold', parseInt(e.target.value))}
                className="setting-input"
                min="1"
                max="100"
              />
              <span className="setting-unit">% of target</span>
            </div>
          </div>
        </div>

        {/* Email Recipients */}
        <div className="settings-section">
          <div className="section-header">
            <Mail size={20} />
            <h3>Email Recipients</h3>
          </div>
          
          <div className="recipients-section">
            <div className="recipient-category">
              <h4>Administrator Emails</h4>
              <div className="email-list">
                {notifications.adminEmails.map((email, index) => (
                  <div key={index} className="email-item">
                    <span>{email}</span>
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => handleRemoveEmail('admin', email)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  className="btn btn-outline"
                  onClick={() => handleAddEmail('admin')}
                >
                  Add Admin Email
                </button>
              </div>
            </div>
            
            <div className="recipient-category">
              <h4>Accountant Emails</h4>
              <div className="email-list">
                {notifications.accountantEmails.map((email, index) => (
                  <div key={index} className="email-item">
                    <span>{email}</span>
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => handleRemoveEmail('accountant', email)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  className="btn btn-outline"
                  onClick={() => handleAddEmail('accountant')}
                >
                  Add Accountant Email
                </button>
              </div>
            </div>
            
            <div className="recipient-category">
              <h4>Manager Emails</h4>
              <div className="email-list">
                {notifications.managerEmails.map((email, index) => (
                  <div key={index} className="email-item">
                    <span>{email}</span>
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => handleRemoveEmail('manager', email)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  className="btn btn-outline"
                  onClick={() => handleAddEmail('manager')}
                >
                  Add Manager Email
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Email Templates */}
        <div className="settings-section">
          <div className="section-header">
            <Mail size={20} />
            <h3>Email Templates</h3>
          </div>
          <div className="templates-list">
            {emailTemplates.map((template) => (
              <div key={template.id} className="template-item">
                <div className="template-info">
                  <div className="template-name">{template.name}</div>
                  <div className="template-subject">{template.subject}</div>
                  <div className="template-details">
                    <span className="frequency">{template.frequency}</span>
                    <span className="recipients">Recipients: {template.recipients}</span>
                    <span className={`status ${template.status.toLowerCase()}`}>
                      {template.status}
                    </span>
                  </div>
                </div>
                <div className="template-actions">
                  <button className="btn-small">Edit</button>
                  <button 
                    className="btn-small btn-outline"
                    onClick={() => handleTestEmail(template.id)}
                  >
                    Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
