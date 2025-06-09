import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  FileText,
  Calendar,
  Download,
  RefreshCw,
  DollarSign,
  Receipt,
  PieChart,
  Target,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { SalesProvider } from '../contexts/SalesContext';
import SalesDashboard from './sales/SalesDashboard';
import DetailedReports from './sales/DetailedReports';
import RevenueAnalytics from './sales/RevenueAnalytics';
import DailySummary from './sales/DailySummary';
import ReturnTracking from './sales/ReturnTracking';
import GSTReports from './sales/GSTReports';
import ExportCenter from './sales/ExportCenter';
import './SalesRevenue.css';

const SalesRevenue = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3,
      description: 'Sales overview and key metrics'
    },
    { 
      id: 'reports', 
      label: 'Detailed Reports', 
      icon: FileText,
      description: 'Comprehensive sales reports with filters'
    },
    { 
      id: 'analytics', 
      label: 'Revenue Analytics', 
      icon: PieChart,
      description: 'Advanced analytics and insights'
    },
    { 
      id: 'daily-summary', 
      label: 'Daily Summary', 
      icon: Calendar,
      description: 'Daily closing reports and summaries'
    },
    { 
      id: 'returns', 
      label: 'Returns & Refunds', 
      icon: RefreshCw,
      description: 'Track returns and refund management'
    },
    { 
      id: 'gst-reports', 
      label: 'GST Reports', 
      icon: Receipt,
      description: 'Tax reports and GST compliance'
    },
    {
      id: 'export',
      label: 'Export Center',
      icon: Download,
      description: 'Export data in various formats'
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
      case 'dashboard':
        return <SalesDashboard />;
      case 'reports':
        return <DetailedReports />;
      case 'analytics':
        return <RevenueAnalytics />;
      case 'daily-summary':
        return <DailySummary />;
      case 'returns':
        return <ReturnTracking />;
      case 'gst-reports':
        return <GSTReports />;
      case 'export':
        return <ExportCenter />;
      default:
        return <SalesDashboard />;
    }
  };

  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  return (
    <SalesProvider>
      <div className="sales-revenue">
        {/* Header Section */}
        <div className="sales-header">
          <div className="header-content">
            <h1>Sales & Revenue Management</h1>
            <p>Comprehensive sales tracking, analytics, and revenue management for Sathya Pharmacy</p>
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
              <Target size={20} />
              Set Sales Target
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card primary">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">₹45,280</div>
              <div className="stat-label">Today's Revenue</div>
              <div className="stat-change up">+12.5% from yesterday</div>
            </div>
          </div>
          
          <div className="stat-card secondary">
            <div className="stat-icon">
              <Receipt size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">127</div>
              <div className="stat-label">Invoices Today</div>
              <div className="stat-change up">+8 from yesterday</div>
            </div>
          </div>
          
          <div className="stat-card accent">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">₹356</div>
              <div className="stat-label">Avg. Sale Value</div>
              <div className="stat-change up">+5.2% this month</div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">3</div>
              <div className="stat-label">Returns Today</div>
              <div className="stat-change down">-2 from yesterday</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="sales-tabs">
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
    </SalesProvider>
  );
};

export default SalesRevenue;
