import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  BarChart3,
  FileText,
  MessageSquare,
  Gift,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { CustomerProvider } from '../contexts/CustomerContext';
import CustomerList from './customers/CustomerList';
import CustomerRegistration from './customers/CustomerRegistration';
import CustomerProfile from './customers/CustomerProfile';
import PrescriptionManagement from './customers/PrescriptionManagement';
import LoyaltyProgram from './customers/LoyaltyProgram';
import CustomerAnalytics from './customers/CustomerAnalytics';
import FeedbackManagement from './customers/FeedbackManagement';
import './CustomerManagement.css';

const CustomerManagement = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { 
      id: 'customers', 
      label: 'Customer List', 
      icon: Users,
      description: 'View and manage all customers'
    },
    { 
      id: 'registration', 
      label: 'Add Customer', 
      icon: UserPlus,
      description: 'Register new customers'
    },
    { 
      id: 'prescriptions', 
      label: 'Prescriptions', 
      icon: FileText,
      description: 'Manage customer prescriptions'
    },
    { 
      id: 'loyalty', 
      label: 'Loyalty Program', 
      icon: Gift,
      description: 'Loyalty points and rewards'
    },
    { 
      id: 'feedback', 
      label: 'Feedback & Complaints', 
      icon: MessageSquare,
      description: 'Customer feedback management'
    },
    { 
      id: 'analytics', 
      label: 'Customer Analytics', 
      icon: BarChart3,
      description: 'Customer insights and reports'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setActiveTab('profile');
  };

  const handleBackToList = () => {
    setSelectedCustomer(null);
    setActiveTab('customers');
  };

  const renderTabContent = () => {
    if (selectedCustomer && activeTab === 'profile') {
      return (
        <CustomerProfile 
          customer={selectedCustomer} 
          onBack={handleBackToList}
          onEdit={() => setShowRegistration(true)}
        />
      );
    }

    switch (activeTab) {
      case 'customers':
        return <CustomerList onCustomerSelect={handleCustomerSelect} />;
      case 'registration':
        return (
          <CustomerRegistration 
            customer={selectedCustomer}
            onSave={() => {
              setShowRegistration(false);
              setSelectedCustomer(null);
              setActiveTab('customers');
            }}
            onCancel={() => {
              setShowRegistration(false);
              setSelectedCustomer(null);
            }}
          />
        );
      case 'prescriptions':
        return <PrescriptionManagement />;
      case 'loyalty':
        return <LoyaltyProgram />;
      case 'feedback':
        return <FeedbackManagement />;
      case 'analytics':
        return <CustomerAnalytics />;
      default:
        return <CustomerList onCustomerSelect={handleCustomerSelect} />;
    }
  };

  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  return (
    <CustomerProvider>
      <div className="customer-management">
        {/* Header Section */}
        <div className="customer-header">
          <div className="header-content">
            <h1>Customer Management</h1>
            <p>Comprehensive customer relationship management for Sathya Pharmacy</p>
          </div>
          <div className="header-actions">
            <button 
              className={`btn btn-secondary ${refreshing ? 'loading' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={20} className={refreshing ? 'spinning' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setActiveTab('registration')}
            >
              <UserPlus size={20} />
              Add New Customer
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">1,247</div>
              <div className="stat-label">Total Customers</div>
              <div className="stat-change up">+23 this month</div>
            </div>
          </div>
          
          <div className="stat-card secondary">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">892</div>
              <div className="stat-label">Active Customers</div>
              <div className="stat-change up">+15 this week</div>
            </div>
          </div>
          
          <div className="stat-card accent">
            <div className="stat-icon">
              <Gift size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">45,230</div>
              <div className="stat-label">Loyalty Points</div>
              <div className="stat-change up">+1,250 today</div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">
              <MessageSquare size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">12</div>
              <div className="stat-label">Pending Feedback</div>
              <div className="stat-change down">-3 resolved</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        {!selectedCustomer && (
          <div className="customer-tabs">
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
        )}

        {/* Active Tab Info */}
        {activeTabInfo && !selectedCustomer && (
          <div className="tab-info">
            <div className="tab-info-content">
              <h2>{activeTabInfo.label}</h2>
              <p>{activeTabInfo.description}</p>
            </div>
            <div className="tab-info-actions">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </CustomerProvider>
  );
};

export default CustomerManagement;
