import { useState } from 'react';
import { Download, Users, TrendingUp, Heart, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { useReports } from '../../contexts/ReportsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomerReports = () => {
  const { getCustomerReports, loading } = useReports();
  const [selectedReport, setSelectedReport] = useState('purchase-history');

  const customerReports = getCustomerReports();
  
  const totalCustomers = customerReports.length;
  const totalRevenue = customerReports.reduce((sum, customer) => sum + customer.totalAmount, 0);
  const avgOrderValue = totalRevenue / customerReports.reduce((sum, customer) => sum + customer.totalPurchases, 0);
  const repeatCustomers = customerReports.filter(customer => customer.totalPurchases > 1).length;

  const topCustomersData = customerReports.slice(0, 10);

  const reportTypes = [
    { id: 'purchase-history', label: 'Customer Purchase History', icon: Users },
    { id: 'top-customers', label: 'Top Customers by Revenue', icon: TrendingUp },
    { id: 'repeat-purchase', label: 'Repeat Purchase Report', icon: Heart },
    { id: 'discount-report', label: 'Customer-wise Discount Report', icon: Gift }
  ];

  const handleExport = (format) => {
    console.log(`Exporting ${selectedReport} report in ${format} format`);
  };

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading customer data...</p>
        </div>
      );
    }

    switch (selectedReport) {
      case 'purchase-history':
        return (
          <div className="report-content">
            <div className="customer-summary">
              <div className="summary-card primary">
                <div className="summary-icon">
                  <Users size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{totalCustomers}</div>
                  <div className="summary-label">Total Customers</div>
                </div>
              </div>
              <div className="summary-card secondary">
                <div className="summary-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{totalRevenue.toLocaleString()}</div>
                  <div className="summary-label">Total Revenue</div>
                </div>
              </div>
              <div className="summary-card accent">
                <div className="summary-icon">
                  <Heart size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{repeatCustomers}</div>
                  <div className="summary-label">Repeat Customers</div>
                </div>
              </div>
              <div className="summary-card warning">
                <div className="summary-icon">
                  <Gift size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{Math.round(avgOrderValue)}</div>
                  <div className="summary-label">Avg Order Value</div>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3>Customer Purchase Summary</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Phone</th>
                      <th>Total Purchases</th>
                      <th>Total Amount</th>
                      <th>Total Discount</th>
                      <th>Avg Order Value</th>
                      <th>Last Purchase</th>
                      <th>Customer Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerReports.map((customer) => (
                      <tr key={customer.customer.id}>
                        <td>{customer.customer.name}</td>
                        <td>{customer.customer.phone}</td>
                        <td>{customer.totalPurchases}</td>
                        <td>₹{customer.totalAmount.toLocaleString()}</td>
                        <td>₹{customer.totalDiscount.toLocaleString()}</td>
                        <td>₹{Math.round(customer.avgOrderValue)}</td>
                        <td>{format(new Date(customer.lastPurchase), 'dd/MM/yyyy')}</td>
                        <td>
                          <span className={`customer-badge ${customer.totalPurchases > 10 ? 'vip' : customer.totalPurchases > 5 ? 'regular' : 'new'}`}>
                            {customer.totalPurchases > 10 ? 'VIP' : customer.totalPurchases > 5 ? 'Regular' : 'New'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'top-customers':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Top 10 Customers by Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCustomersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="customer.name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="totalAmount" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="report-section">
              <h3>Top Customer Details</h3>
              <div className="top-customers-grid">
                {topCustomersData.slice(0, 6).map((customer, index) => (
                  <div key={customer.customer.id} className="customer-card">
                    <div className="customer-rank">#{index + 1}</div>
                    <div className="customer-info">
                      <h4>{customer.customer.name}</h4>
                      <p>{customer.customer.phone}</p>
                    </div>
                    <div className="customer-stats">
                      <div className="stat">
                        <span className="stat-value">₹{customer.totalAmount.toLocaleString()}</span>
                        <span className="stat-label">Total Revenue</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{customer.totalPurchases}</span>
                        <span className="stat-label">Purchases</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'repeat-purchase':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Customer Loyalty Analysis</h3>
              <div className="loyalty-stats">
                <div className="loyalty-card">
                  <h4>New Customers</h4>
                  <div className="loyalty-value">{customerReports.filter(c => c.totalPurchases === 1).length}</div>
                  <div className="loyalty-detail">Single purchase only</div>
                </div>
                <div className="loyalty-card">
                  <h4>Regular Customers</h4>
                  <div className="loyalty-value">{customerReports.filter(c => c.totalPurchases >= 2 && c.totalPurchases <= 5).length}</div>
                  <div className="loyalty-detail">2-5 purchases</div>
                </div>
                <div className="loyalty-card">
                  <h4>Loyal Customers</h4>
                  <div className="loyalty-value">{customerReports.filter(c => c.totalPurchases >= 6 && c.totalPurchases <= 10).length}</div>
                  <div className="loyalty-detail">6-10 purchases</div>
                </div>
                <div className="loyalty-card">
                  <h4>VIP Customers</h4>
                  <div className="loyalty-value">{customerReports.filter(c => c.totalPurchases > 10).length}</div>
                  <div className="loyalty-detail">10+ purchases</div>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3>Repeat Customers</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Total Purchases</th>
                      <th>Total Amount</th>
                      <th>First Purchase</th>
                      <th>Last Purchase</th>
                      <th>Loyalty Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerReports.filter(customer => customer.totalPurchases > 1).map((customer) => {
                      const loyaltyScore = Math.min(100, (customer.totalPurchases * 10) + (customer.totalAmount / 1000));
                      return (
                        <tr key={customer.customer.id}>
                          <td>{customer.customer.name}</td>
                          <td>{customer.totalPurchases}</td>
                          <td>₹{customer.totalAmount.toLocaleString()}</td>
                          <td>{format(new Date(customer.lastPurchase), 'dd/MM/yyyy')}</td>
                          <td>{format(new Date(customer.lastPurchase), 'dd/MM/yyyy')}</td>
                          <td>
                            <div className="loyalty-score">
                              <div className="score-bar">
                                <div 
                                  className="score-fill" 
                                  style={{ width: `${loyaltyScore}%` }}
                                ></div>
                              </div>
                              <span>{Math.round(loyaltyScore)}</span>
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
          <h2>Customer Reports</h2>
          <p>Track purchasing behavior and customer loyalty</p>
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

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
};

export default CustomerReports;
