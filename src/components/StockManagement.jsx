import { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Search, 
  Filter,
  BarChart3,
  RefreshCw,
  Settings,
  TrendingUp,
  ArrowUpDown,
  FileText,
  Calendar,
  Activity
} from 'lucide-react';
import { StockProvider } from '../contexts/StockContext';
import StockOverview from './stock/StockOverview';
import LowStockAlerts from './stock/LowStockAlerts';
import StockSearch from './stock/StockSearch';
import StockAdjustment from './stock/StockAdjustment';
import StockTransfer from './stock/StockTransfer';
import StockReports from './stock/StockReports';
import StockHistory from './stock/StockHistory';
import './StockManagement.css';

const StockManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { 
      id: 'overview', 
      label: 'Stock Overview', 
      icon: Package,
      description: 'Real-time stock levels and quick stats'
    },
    { 
      id: 'alerts', 
      label: 'Low Stock Alerts', 
      icon: AlertTriangle,
      description: 'Monitor low stock and reorder alerts'
    },
    { 
      id: 'search', 
      label: 'Stock Search', 
      icon: Search,
      description: 'Advanced stock search and filtering'
    },
    { 
      id: 'adjustment', 
      label: 'Stock Adjustment', 
      icon: Settings,
      description: 'Manual stock adjustments and corrections'
    },
    { 
      id: 'transfer', 
      label: 'Stock Transfer', 
      icon: ArrowUpDown,
      description: 'Transfer stock between branches'
    },
    { 
      id: 'reports', 
      label: 'Stock Reports', 
      icon: BarChart3,
      description: 'Comprehensive stock analytics and reports'
    },
    { 
      id: 'history', 
      label: 'Stock History', 
      icon: Activity,
      description: 'Track all stock movements and changes'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StockOverview />;
      case 'alerts':
        return <LowStockAlerts />;
      case 'search':
        return <StockSearch />;
      case 'adjustment':
        return <StockAdjustment />;
      case 'transfer':
        return <StockTransfer />;
      case 'reports':
        return <StockReports />;
      case 'history':
        return <StockHistory />;
      default:
        return <StockOverview />;
    }
  };

  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  return (
    <StockProvider>
      <div className="stock-management">
        {/* Header Section */}
        <div className="stock-header">
          <div className="header-content">
            <h1>Stock Management</h1>
            <p>Real-time stock control with automated alerts, adjustments, and comprehensive reporting</p>
          </div>
          <div className="header-actions">
            <button 
              className={`btn btn-secondary ${refreshing ? 'loading' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={20} className={refreshing ? 'spinning' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Stock'}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">1,247</div>
              <div className="stat-label">Total Items</div>
              <div className="stat-change up">+12 this week</div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">23</div>
              <div className="stat-label">Low Stock Alerts</div>
              <div className="stat-change down">-5 from yesterday</div>
            </div>
          </div>
          
          <div className="stat-card danger">
            <div className="stat-icon">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">7</div>
              <div className="stat-label">Out of Stock</div>
              <div className="stat-change">Immediate attention needed</div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">₹8.45L</div>
              <div className="stat-label">Stock Value</div>
              <div className="stat-change up">+15% from last month</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="stock-tabs">
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
    </StockProvider>
  );
};

export default StockManagement;
