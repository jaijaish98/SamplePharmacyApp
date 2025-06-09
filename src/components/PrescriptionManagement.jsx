import { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Search, 
  Filter,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Camera,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { PrescriptionProvider } from '../contexts/PrescriptionContext';
import PrescriptionList from './prescriptions/PrescriptionList';
import PrescriptionUpload from './prescriptions/PrescriptionUpload';
import PrescriptionValidation from './prescriptions/PrescriptionValidation';
import PrescriptionFulfillment from './prescriptions/PrescriptionFulfillment';
import PrescriptionAnalytics from './prescriptions/PrescriptionAnalytics';
import PrescriptionCompliance from './prescriptions/PrescriptionCompliance';
import PrescriptionDetail from './prescriptions/PrescriptionDetail';
import './PrescriptionManagement.css';

const PrescriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { 
      id: 'prescriptions', 
      label: 'All Prescriptions', 
      icon: FileText,
      description: 'View and manage all prescriptions'
    },
    { 
      id: 'upload', 
      label: 'Upload Prescription', 
      icon: Upload,
      description: 'Upload new prescriptions'
    },
    { 
      id: 'validation', 
      label: 'Validation Queue', 
      icon: CheckCircle,
      description: 'Validate pending prescriptions'
    },
    { 
      id: 'fulfillment', 
      label: 'Fulfillment', 
      icon: Clock,
      description: 'Track prescription fulfillment'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      description: 'Prescription insights and reports'
    },
    { 
      id: 'compliance', 
      label: 'Compliance', 
      icon: AlertTriangle,
      description: 'Regulatory compliance and records'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handlePrescriptionSelect = (prescription) => {
    setSelectedPrescription(prescription);
    setActiveTab('detail');
  };

  const handleBackToList = () => {
    setSelectedPrescription(null);
    setActiveTab('prescriptions');
  };

  const renderTabContent = () => {
    if (selectedPrescription && activeTab === 'detail') {
      return (
        <PrescriptionDetail 
          prescription={selectedPrescription} 
          onBack={handleBackToList}
          onEdit={() => setShowUpload(true)}
        />
      );
    }

    switch (activeTab) {
      case 'prescriptions':
        return <PrescriptionList onPrescriptionSelect={handlePrescriptionSelect} />;
      case 'upload':
        return (
          <PrescriptionUpload 
            prescription={selectedPrescription}
            onSave={() => {
              setShowUpload(false);
              setSelectedPrescription(null);
              setActiveTab('prescriptions');
            }}
            onCancel={() => {
              setShowUpload(false);
              setSelectedPrescription(null);
            }}
          />
        );
      case 'validation':
        return <PrescriptionValidation />;
      case 'fulfillment':
        return <PrescriptionFulfillment />;
      case 'analytics':
        return <PrescriptionAnalytics />;
      case 'compliance':
        return <PrescriptionCompliance />;
      default:
        return <PrescriptionList onPrescriptionSelect={handlePrescriptionSelect} />;
    }
  };

  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  return (
    <PrescriptionProvider>
      <div className="prescription-management">
        {/* Header Section */}
        <div className="prescription-header">
          <div className="header-content">
            <h1>Prescription Management</h1>
            <p>Complete digital prescription handling with validation, fulfillment, and compliance</p>
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
              onClick={() => setActiveTab('upload')}
            >
              <Upload size={20} />
              Upload Prescription
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card primary">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">247</div>
              <div className="stat-label">Total Prescriptions</div>
              <div className="stat-change up">+12 this week</div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">18</div>
              <div className="stat-label">Pending Validation</div>
              <div className="stat-change down">-5 from yesterday</div>
            </div>
          </div>
          
          <div className="stat-card accent">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">156</div>
              <div className="stat-label">Fulfilled</div>
              <div className="stat-change up">+8 today</div>
            </div>
          </div>
          
          <div className="stat-card danger">
            <div className="stat-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">7</div>
              <div className="stat-label">Expiring Soon</div>
              <div className="stat-change">Next 7 days</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        {!selectedPrescription && (
          <div className="prescription-tabs">
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
        {activeTabInfo && !selectedPrescription && (
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
    </PrescriptionProvider>
  );
};

export default PrescriptionManagement;
