import { useState } from 'react';
import { 
  Users, 
  Shield, 
  Settings as SettingsIcon, 
  Database,
  Mail,
  Bell,
  Lock,
  Globe,
  Printer,
  Smartphone
} from 'lucide-react';
import UserManagement from './settings/UserManagement';
import SystemSettings from './settings/SystemSettings';
import SecuritySettings from './settings/SecuritySettings';
import NotificationSettings from './settings/NotificationSettings';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users,
      description: 'Manage users, roles, and permissions'
    },
    { 
      id: 'system', 
      label: 'System Settings', 
      icon: SettingsIcon,
      description: 'General system configuration'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: Shield,
      description: 'Security and access control settings'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell,
      description: 'Email and alert preferences'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'system':
        return <SystemSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return <UserManagement />;
    }
  };

  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="settings">
      {/* Header Section */}
      <div className="settings-header">
        <div className="header-content">
          <h1>System Settings</h1>
          <p>Configure system-wide settings, user management, and security preferences</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="settings-tabs">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.description}
            >
              <IconComponent size={20} />
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Info */}
      {activeTabInfo && (
        <div className="tab-info">
          <div className="tab-info-content">
            <h2>{activeTabInfo.label}</h2>
            <p>{activeTabInfo.description}</p>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;
