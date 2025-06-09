import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import { ReportsProvider } from '../contexts/ReportsContext';
import SalesReports from './reports/SalesReports';
import InventoryReports from './reports/InventoryReports';
import ExpiryReports from './reports/ExpiryReports';
import PurchaseReports from './reports/PurchaseReports';
import ProfitabilityReports from './reports/ProfitabilityReports';
import CustomerReports from './reports/CustomerReports';
import GSTTaxReports from './reports/GSTTaxReports';
import AlertsAnalytics from './reports/AlertsAnalytics';
import './ReportsAnalytics.css';

const ReportsAnalytics = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { 
      id: 'sales', 
      label: 'Sales Reports', 
      icon: BarChart3,
      description: 'Track billing activity, revenue trends, and performance'
    },
    { 
      id: 'inventory', 
      label: 'Inventory Reports', 
      icon: Package,
      description: 'Current stock, valuation, and movement reports'
    },
    { 
      id: 'expiry', 
      label: 'Expiry Reports', 
      icon: AlertTriangle,
      description: 'Near expiry and expired medicine tracking'
    },
    { 
      id: 'purchase', 
      label: 'Purchase Reports', 
      icon: ShoppingCart,
      description: 'Purchase trends and supplier analysis'
    },
    { 
      id: 'profitability', 
      label: 'Profitability', 
      icon: TrendingUp,
      description: 'Profit margins and business health analysis'
    },
    { 
      id: 'gst-tax', 
      label: 'GST & Tax', 
      icon: FileText,
      description: 'Tax reports and compliance documentation'
    },
    { 
      id: 'customers', 
      label: 'Customer Reports', 
      icon: Users,
      description: 'Customer behavior and loyalty analysis'
    },
    { 
      id: 'alerts', 
      label: 'Alerts & Analytics', 
      icon: Activity,
      description: 'Business insights and automated alerts'
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
      case 'sales':
        return <SalesReports />;
      case 'inventory':
        return <InventoryReports />;
      case 'expiry':
        return <ExpiryReports />;
      case 'purchase':
        return <PurchaseReports />;
      case 'profitability':
        return <ProfitabilityReports />;
      case 'gst-tax':
        return <GSTTaxReports />;
      case 'customers':
        return <CustomerReports />;
      case 'alerts':
        return <AlertsAnalytics />;
      default:
        return <SalesReports />;
    }
  };

  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  return (
    <ReportsProvider>
      <div className="reports-analytics">
        {/* Header Section */}
        <div className="reports-header">
          <div className="header-content">
            <h1>Reports & Analytics</h1>
            <p>Comprehensive business intelligence and reporting for Sathya Pharmacy</p>
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
            <button className="btn btn-primary">
              <Download size={20} />
              Export All Reports
            </button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="quick-metrics">
          <div className="metric-card primary">
            <div className="metric-icon">
              <BarChart3 size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">₹1,23,450</div>
              <div className="metric-label">Monthly Revenue</div>
              <div className="metric-change up">+15.2% from last month</div>
            </div>
          </div>
          
          <div className="metric-card secondary">
            <div className="metric-icon">
              <Package size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">2,847</div>
              <div className="metric-label">Items in Stock</div>
              <div className="metric-change up">+3.1% this month</div>
            </div>
          </div>
          
          <div className="metric-card accent">
            <div className="metric-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">23</div>
              <div className="metric-label">Near Expiry Items</div>
              <div className="metric-change down">-5 from last week</div>
            </div>
          </div>
          
          <div className="metric-card warning">
            <div className="metric-icon">
              <TrendingUp size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">28.5%</div>
              <div className="metric-label">Avg Profit Margin</div>
              <div className="metric-change up">+2.1% improvement</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="reports-tabs">
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
              <Clock size={16} />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </ReportsProvider>
  );
};

export default ReportsAnalytics;
