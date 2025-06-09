import { useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle, Key, Clock } from 'lucide-react';

const SecuritySettings = () => {
  const [securitySettings, setSecuritySettings] = useState({
    // Password Policy
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiry: 90,
    
    // Session Management
    sessionTimeout: 30,
    maxConcurrentSessions: 3,
    autoLogoutInactive: true,
    
    // Access Control
    maxLoginAttempts: 3,
    lockoutDuration: 15,
    twoFactorAuth: false,
    ipWhitelisting: false,
    
    // Audit & Monitoring
    logAllAccess: true,
    logFailedAttempts: true,
    alertOnSuspiciousActivity: true,
    dataEncryption: true
  });

  const [accessLog] = useState([
    {
      id: 1,
      timestamp: '2024-01-15 14:30:25',
      user: 'Dr. Sathya',
      action: 'Login',
      ipAddress: '192.168.1.100',
      status: 'Success',
      module: 'Dashboard'
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:25:10',
      user: 'Pharmacist A',
      action: 'View Sales Report',
      ipAddress: '192.168.1.101',
      status: 'Success',
      module: 'Sales'
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:20:45',
      user: 'Unknown',
      action: 'Failed Login',
      ipAddress: '203.0.113.1',
      status: 'Failed',
      module: 'Authentication'
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:15:30',
      user: 'Store Manager',
      action: 'Export Data',
      ipAddress: '192.168.1.102',
      status: 'Success',
      module: 'Reports'
    }
  ]);

  const handleSettingChange = (key, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving security settings:', securitySettings);
  };

  const handleClearLogs = () => {
    console.log('Clearing access logs');
  };

  return (
    <div className="security-settings">
      <div className="settings-header">
        <div className="header-info">
          <h2>Security & Access Control</h2>
          <p>Configure security policies, access controls, and monitoring settings</p>
        </div>
        <button className="btn btn-primary" onClick={handleSaveSettings}>
          <Shield size={16} />
          Save Security Settings
        </button>
      </div>

      <div className="settings-content">
        {/* Password Policy */}
        <div className="settings-section">
          <div className="section-header">
            <Lock size={20} />
            <h3>Password Policy</h3>
          </div>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Minimum Password Length</label>
              <input
                type="number"
                value={securitySettings.minPasswordLength}
                onChange={(e) => handleSettingChange('minPasswordLength', parseInt(e.target.value))}
                className="setting-input"
                min="6"
                max="20"
              />
            </div>
            <div className="setting-item">
              <label>Password Expiry (days)</label>
              <input
                type="number"
                value={securitySettings.passwordExpiry}
                onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                className="setting-input"
                min="30"
                max="365"
              />
            </div>
          </div>
          
          <div className="password-requirements">
            <h4>Password Requirements</h4>
            <div className="requirements-list">
              <div className="requirement-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={securitySettings.requireUppercase}
                    onChange={(e) => handleSettingChange('requireUppercase', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Require uppercase letters (A-Z)
                </label>
              </div>
              <div className="requirement-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={securitySettings.requireLowercase}
                    onChange={(e) => handleSettingChange('requireLowercase', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Require lowercase letters (a-z)
                </label>
              </div>
              <div className="requirement-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={securitySettings.requireNumbers}
                    onChange={(e) => handleSettingChange('requireNumbers', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Require numbers (0-9)
                </label>
              </div>
              <div className="requirement-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={securitySettings.requireSpecialChars}
                    onChange={(e) => handleSettingChange('requireSpecialChars', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Require special characters (!@#$%^&*)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="settings-section">
          <div className="section-header">
            <Clock size={20} />
            <h3>Session Management</h3>
          </div>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Session Timeout (minutes)</label>
              <input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="setting-input"
                min="5"
                max="120"
              />
            </div>
            <div className="setting-item">
              <label>Max Concurrent Sessions</label>
              <input
                type="number"
                value={securitySettings.maxConcurrentSessions}
                onChange={(e) => handleSettingChange('maxConcurrentSessions', parseInt(e.target.value))}
                className="setting-input"
                min="1"
                max="10"
              />
            </div>
          </div>
          
          <div className="session-options">
            <div className="option-item">
              <div className="option-info">
                <label>Auto-logout on Inactivity</label>
                <p>Automatically log out users after session timeout</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securitySettings.autoLogoutInactive}
                  onChange={(e) => handleSettingChange('autoLogoutInactive', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="settings-section">
          <div className="section-header">
            <Key size={20} />
            <h3>Access Control</h3>
          </div>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Max Login Attempts</label>
              <input
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                className="setting-input"
                min="3"
                max="10"
              />
            </div>
            <div className="setting-item">
              <label>Lockout Duration (minutes)</label>
              <input
                type="number"
                value={securitySettings.lockoutDuration}
                onChange={(e) => handleSettingChange('lockoutDuration', parseInt(e.target.value))}
                className="setting-input"
                min="5"
                max="60"
              />
            </div>
          </div>
          
          <div className="access-options">
            <div className="option-item">
              <div className="option-info">
                <label>Two-Factor Authentication</label>
                <p>Require additional verification for login</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="option-item">
              <div className="option-info">
                <label>IP Whitelisting</label>
                <p>Restrict access to specific IP addresses</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securitySettings.ipWhitelisting}
                  onChange={(e) => handleSettingChange('ipWhitelisting', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Audit & Monitoring */}
        <div className="settings-section">
          <div className="section-header">
            <Eye size={20} />
            <h3>Audit & Monitoring</h3>
          </div>
          <div className="audit-options">
            <div className="option-item">
              <div className="option-info">
                <label>Log All User Access</label>
                <p>Record all user login and access activities</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securitySettings.logAllAccess}
                  onChange={(e) => handleSettingChange('logAllAccess', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="option-item">
              <div className="option-info">
                <label>Log Failed Login Attempts</label>
                <p>Record unsuccessful login attempts for security monitoring</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securitySettings.logFailedAttempts}
                  onChange={(e) => handleSettingChange('logFailedAttempts', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="option-item">
              <div className="option-info">
                <label>Alert on Suspicious Activity</label>
                <p>Send notifications for unusual access patterns</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securitySettings.alertOnSuspiciousActivity}
                  onChange={(e) => handleSettingChange('alertOnSuspiciousActivity', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="option-item">
              <div className="option-info">
                <label>Data Encryption</label>
                <p>Encrypt sensitive data in database and transit</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securitySettings.dataEncryption}
                  onChange={(e) => handleSettingChange('dataEncryption', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Access Log */}
        <div className="settings-section">
          <div className="section-header">
            <AlertTriangle size={20} />
            <h3>Recent Access Log</h3>
            <button className="btn btn-outline btn-small" onClick={handleClearLogs}>
              Clear Logs
            </button>
          </div>
          <div className="access-log">
            <div className="log-table">
              <div className="log-header">
                <div>Timestamp</div>
                <div>User</div>
                <div>Action</div>
                <div>IP Address</div>
                <div>Status</div>
                <div>Module</div>
              </div>
              {accessLog.map((entry) => (
                <div key={entry.id} className="log-entry">
                  <div className="log-timestamp">{entry.timestamp}</div>
                  <div className="log-user">{entry.user}</div>
                  <div className="log-action">{entry.action}</div>
                  <div className="log-ip">{entry.ipAddress}</div>
                  <div className={`log-status ${entry.status.toLowerCase()}`}>
                    {entry.status}
                  </div>
                  <div className="log-module">{entry.module}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
