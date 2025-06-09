import { useState } from 'react';
import { 
  Truck, 
  UserPlus, 
  Search, 
  Filter,
  BarChart3,
  ShoppingCart,
  Package,
  CreditCard,
  FileText,
  TrendingUp,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { SupplierProvider } from '../contexts/SupplierContext';
import SupplierList from './suppliers/SupplierList';
import SupplierRegistration from './suppliers/SupplierRegistration';
import PurchaseOrderManagement from './suppliers/PurchaseOrderManagement';
import PurchaseHistory from './suppliers/PurchaseHistory';
import GRNManagement from './suppliers/GRNManagement';
import PaymentManagement from './suppliers/PaymentManagement';
import SupplierReturns from './suppliers/SupplierReturns';
import SupplierAnalytics from './suppliers/SupplierAnalytics';
import SupplierDetail from './suppliers/SupplierDetail';
import './SupplierManagement.css';

const SupplierManagement = () => {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { 
      id: 'suppliers', 
      label: 'All Suppliers', 
      icon: Truck,
      description: 'View and manage supplier directory'
    },
    { 
      id: 'registration', 
      label: 'Add Supplier', 
      icon: UserPlus,
      description: 'Register new suppliers'
    },
    { 
      id: 'purchase-orders', 
      label: 'Purchase Orders', 
      icon: ShoppingCart,
      description: 'Manage purchase orders and procurement'
    },
    { 
      id: 'purchase-history', 
      label: 'Purchase History', 
      icon: FileText,
      description: 'Track purchase history and trends'
    },
    { 
      id: 'grn', 
      label: 'Goods Receipt', 
      icon: Package,
      description: 'Goods Receipt Note management'
    },
    { 
      id: 'payments', 
      label: 'Payment Management', 
      icon: CreditCard,
      description: 'Track payments and outstanding dues'
    },
    { 
      id: 'returns', 
      label: 'Returns', 
      icon: TrendingUp,
      description: 'Manage returns to suppliers'
    },
    { 
      id: 'analytics', 
      label: 'Performance Analytics', 
      icon: BarChart3,
      description: 'Supplier performance insights'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setActiveTab('detail');
  };

  const handleBackToList = () => {
    setSelectedSupplier(null);
    setActiveTab('suppliers');
  };

  const renderTabContent = () => {
    if (selectedSupplier && activeTab === 'detail') {
      return (
        <SupplierDetail 
          supplier={selectedSupplier} 
          onBack={handleBackToList}
          onEdit={() => {
            setShowRegistration(true);
            setActiveTab('registration');
          }}
        />
      );
    }

    switch (activeTab) {
      case 'suppliers':
        return <SupplierList onSupplierSelect={handleSupplierSelect} />;
      case 'registration':
        return (
          <SupplierRegistration 
            supplier={selectedSupplier}
            onSave={() => {
              setShowRegistration(false);
              setSelectedSupplier(null);
              setActiveTab('suppliers');
            }}
            onCancel={() => {
              setShowRegistration(false);
              setSelectedSupplier(null);
            }}
          />
        );
      case 'purchase-orders':
        return <PurchaseOrderManagement />;
      case 'purchase-history':
        return <PurchaseHistory />;
      case 'grn':
        return <GRNManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'returns':
        return <SupplierReturns />;
      case 'analytics':
        return <SupplierAnalytics />;
      default:
        return <SupplierList onSupplierSelect={handleSupplierSelect} />;
    }
  };

  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  return (
    <SupplierProvider>
      <div className="supplier-management">
        {/* Header Section */}
        <div className="supplier-header">
          <div className="header-content">
            <h1>Supplier Management</h1>
            <p>Complete supplier lifecycle management with procurement, payments, and performance tracking</p>
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
              Add Supplier
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Truck size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">28</div>
              <div className="stat-label">Total Suppliers</div>
              <div className="stat-change up">+3 this month</div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">₹12.5L</div>
              <div className="stat-label">Total Purchases</div>
              <div className="stat-change up">+8% from last month</div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">
              <CreditCard size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">₹45K</div>
              <div className="stat-label">Outstanding Dues</div>
              <div className="stat-change down">-12% from last month</div>
            </div>
          </div>
          
          <div className="stat-card accent">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">94%</div>
              <div className="stat-label">On-time Delivery</div>
              <div className="stat-change up">+2% improvement</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        {!selectedSupplier && (
          <div className="supplier-tabs">
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
        {activeTabInfo && !selectedSupplier && (
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
    </SupplierProvider>
  );
};

export default SupplierManagement;
