import { useState } from 'react';
import { Download, AlertTriangle, Calendar, Package, RefreshCw } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useReports } from '../../contexts/ReportsContext';

const ExpiryReports = () => {
  const { getExpiryReports, loading } = useReports();
  const [selectedReport, setSelectedReport] = useState('near-expiry');
  const [expiryDays, setExpiryDays] = useState(30);
  const [filters, setFilters] = useState({
    category: '',
    supplier: '',
    location: ''
  });

  const { nearExpiry, expired } = getExpiryReports(expiryDays);

  // Calculate expiry metrics
  const nearExpiryValue = nearExpiry.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  const expiredValue = expired.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  const totalAtRiskValue = nearExpiryValue + expiredValue;

  const reportTypes = [
    { id: 'near-expiry', label: 'Near Expiry Report', icon: AlertTriangle },
    { id: 'expired', label: 'Expired Medicine Report', icon: Package },
    { id: 'expiry-analysis', label: 'Expiry Analysis', icon: Calendar }
  ];

  const handleExport = (format) => {
    console.log(`Exporting ${selectedReport} report in ${format} format`);
  };

  const handleMarkWriteOff = (itemId) => {
    console.log(`Marking item ${itemId} as write-off`);
  };

  const handleReturnToSupplier = (itemId) => {
    console.log(`Initiating return to supplier for item ${itemId}`);
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const daysToExpiry = differenceInDays(new Date(expiryDate), today);
    
    if (daysToExpiry < 0) return { status: 'expired', label: 'Expired', class: 'expired' };
    if (daysToExpiry <= 7) return { status: 'critical', label: `${daysToExpiry} days`, class: 'critical' };
    if (daysToExpiry <= 30) return { status: 'warning', label: `${daysToExpiry} days`, class: 'warning' };
    return { status: 'safe', label: `${daysToExpiry} days`, class: 'safe' };
  };

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading expiry data...</p>
        </div>
      );
    }

    switch (selectedReport) {
      case 'near-expiry':
        return (
          <div className="report-content">
            <div className="expiry-summary">
              <div className="summary-card warning">
                <div className="summary-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{nearExpiry.length}</div>
                  <div className="summary-label">Near Expiry Items</div>
                  <div className="summary-detail">Next {expiryDays} days</div>
                </div>
              </div>
              <div className="summary-card danger">
                <div className="summary-icon">
                  <Package size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{nearExpiryValue.toLocaleString()}</div>
                  <div className="summary-label">Value at Risk</div>
                  <div className="summary-detail">Potential loss</div>
                </div>
              </div>
              <div className="summary-card primary">
                <div className="summary-icon">
                  <Calendar size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{nearExpiry.filter(item => differenceInDays(new Date(item.expiryDate), new Date()) <= 7).length}</div>
                  <div className="summary-label">Critical (≤7 days)</div>
                  <div className="summary-detail">Immediate action needed</div>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3>Near Expiry Items (Next {expiryDays} days)</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Batch No</th>
                      <th>Expiry Date</th>
                      <th>Days to Expiry</th>
                      <th>Quantity</th>
                      <th>Cost Value</th>
                      <th>MRP Value</th>
                      <th>Supplier</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nearExpiry.map((item) => {
                      const expiryInfo = getExpiryStatus(item.expiryDate);
                      return (
                        <tr key={item.id}>
                          <td>{item.medicine.name}</td>
                          <td className="batch-no">{item.batchNo}</td>
                          <td>{format(new Date(item.expiryDate), 'dd/MM/yyyy')}</td>
                          <td>
                            <span className={`expiry-badge ${expiryInfo.class}`}>
                              {expiryInfo.label}
                            </span>
                          </td>
                          <td>{item.quantity}</td>
                          <td>₹{(item.quantity * item.costPrice).toLocaleString()}</td>
                          <td>₹{(item.quantity * item.mrp).toLocaleString()}</td>
                          <td>{item.supplier}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-small btn-outline"
                                onClick={() => handleReturnToSupplier(item.id)}
                              >
                                Return
                              </button>
                              <button 
                                className="btn-small btn-danger"
                                onClick={() => handleMarkWriteOff(item.id)}
                              >
                                Write-off
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="report-content">
            <div className="expiry-summary">
              <div className="summary-card danger">
                <div className="summary-icon">
                  <Package size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{expired.length}</div>
                  <div className="summary-label">Expired Items</div>
                  <div className="summary-detail">Requires immediate action</div>
                </div>
              </div>
              <div className="summary-card warning">
                <div className="summary-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{expiredValue.toLocaleString()}</div>
                  <div className="summary-label">Expired Value</div>
                  <div className="summary-detail">Total loss</div>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3>Expired Medicines</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Batch No</th>
                      <th>Expiry Date</th>
                      <th>Days Expired</th>
                      <th>Quantity</th>
                      <th>Cost Value</th>
                      <th>Supplier</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expired.map((item) => {
                      const daysExpired = Math.abs(differenceInDays(new Date(item.expiryDate), new Date()));
                      return (
                        <tr key={item.id} className="expired-row">
                          <td>{item.medicine.name}</td>
                          <td className="batch-no">{item.batchNo}</td>
                          <td>{format(new Date(item.expiryDate), 'dd/MM/yyyy')}</td>
                          <td>
                            <span className="expiry-badge expired">
                              {daysExpired} days ago
                            </span>
                          </td>
                          <td>{item.quantity}</td>
                          <td>₹{(item.quantity * item.costPrice).toLocaleString()}</td>
                          <td>{item.supplier}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-small btn-danger"
                                onClick={() => handleMarkWriteOff(item.id)}
                              >
                                Write-off
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'expiry-analysis':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Expiry Analysis Summary</h3>
              <div className="analysis-grid">
                <div className="analysis-card">
                  <h4>Total Items at Risk</h4>
                  <div className="analysis-value">{nearExpiry.length + expired.length}</div>
                  <div className="analysis-detail">
                    {nearExpiry.length} near expiry + {expired.length} expired
                  </div>
                </div>
                
                <div className="analysis-card">
                  <h4>Total Value at Risk</h4>
                  <div className="analysis-value">₹{totalAtRiskValue.toLocaleString()}</div>
                  <div className="analysis-detail">
                    Cost value of all at-risk items
                  </div>
                </div>
                
                <div className="analysis-card">
                  <h4>Most Affected Category</h4>
                  <div className="analysis-value">
                    {nearExpiry.reduce((acc, item) => {
                      acc[item.medicine.category] = (acc[item.medicine.category] || 0) + 1;
                      return acc;
                    }, {})}
                  </div>
                  <div className="analysis-detail">
                    Category with most near-expiry items
                  </div>
                </div>
                
                <div className="analysis-card">
                  <h4>Action Required</h4>
                  <div className="analysis-value">
                    {nearExpiry.filter(item => differenceInDays(new Date(item.expiryDate), new Date()) <= 7).length}
                  </div>
                  <div className="analysis-detail">
                    Items requiring immediate action
                  </div>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3>Category-wise Expiry Breakdown</h3>
              <div className="category-breakdown">
                {['OTC', 'Prescription', 'Supplements', 'Devices'].map(category => {
                  const categoryItems = nearExpiry.filter(item => item.medicine.category === category);
                  const categoryValue = categoryItems.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
                  
                  return (
                    <div key={category} className="category-item">
                      <div className="category-header">
                        <span className="category-name">{category}</span>
                        <span className="category-count">{categoryItems.length} items</span>
                      </div>
                      <div className="category-value">₹{categoryValue.toLocaleString()}</div>
                      <div className="category-bar">
                        <div 
                          className="category-fill" 
                          style={{ width: `${(categoryValue / totalAtRiskValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Report Coming Soon</h3>
              <p>This report is under development and will be available soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <div className="header-info">
          <h2>Expiry Reports</h2>
          <p>Prevent revenue loss and ensure compliance with expiry tracking</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => handleExport('pdf')}>
            <Download size={16} />
            Export PDF
          </button>
          <button className="btn btn-outline" onClick={() => handleExport('excel')}>
            <Download size={16} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="report-types">
        {reportTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.id}
              className={`report-type-btn ${selectedReport === type.id ? 'active' : ''}`}
              onClick={() => setSelectedReport(type.id)}
            >
              <IconComponent size={20} />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="report-filters">
        <div className="filter-group">
          <label>Expiry Range</label>
          <select
            value={expiryDays}
            onChange={(e) => setExpiryDays(Number(e.target.value))}
            className="filter-select"
          >
            <option value={30}>Next 30 days</option>
            <option value={60}>Next 60 days</option>
            <option value={90}>Next 90 days</option>
            <option value={180}>Next 6 months</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="otc">OTC</option>
            <option value="prescription">Prescription</option>
            <option value="supplements">Supplements</option>
            <option value="devices">Devices</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Supplier</label>
          <select
            value={filters.supplier}
            onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Suppliers</option>
            <option value="medplus">MedPlus Distributors</option>
            <option value="apollo">Apollo Pharmacy</option>
            <option value="cipla">Cipla Ltd</option>
          </select>
        </div>
      </div>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
};

export default ExpiryReports;
