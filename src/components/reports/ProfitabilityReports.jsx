import { useState } from 'react';
import { Download, TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';
import { useReports } from '../../contexts/ReportsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const ProfitabilityReports = () => {
  const { getProfitabilityReports, loading } = useReports();
  const [selectedReport, setSelectedReport] = useState('profit-by-product');

  const profitData = getProfitabilityReports();
  
  const totalProfit = profitData.reduce((sum, item) => sum + (item.profit * item.quantity), 0);
  const avgMargin = profitData.reduce((sum, item) => sum + item.margin, 0) / profitData.length;
  const highMarginItems = profitData.filter(item => item.margin > 30).length;
  const lowMarginItems = profitData.filter(item => item.margin < 10).length;

  const reportTypes = [
    { id: 'profit-by-product', label: 'Profit by Product', icon: TrendingUp },
    { id: 'profit-by-invoice', label: 'Profit by Invoice', icon: DollarSign },
    { id: 'top-profitable', label: 'Top Profitable Products', icon: Target },
    { id: 'low-margin', label: 'Low Margin/Negative Margin Sales', icon: BarChart3 }
  ];

  const handleExport = (format) => {
    console.log(`Exporting ${selectedReport} report in ${format} format`);
  };

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading profitability data...</p>
        </div>
      );
    }

    switch (selectedReport) {
      case 'profit-by-product':
        return (
          <div className="report-content">
            <div className="profit-summary">
              <div className="summary-card primary">
                <div className="summary-icon">
                  <DollarSign size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{totalProfit.toLocaleString()}</div>
                  <div className="summary-label">Total Profit</div>
                </div>
              </div>
              <div className="summary-card secondary">
                <div className="summary-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{avgMargin.toFixed(1)}%</div>
                  <div className="summary-label">Avg Margin</div>
                </div>
              </div>
              <div className="summary-card accent">
                <div className="summary-icon">
                  <Target size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{highMarginItems}</div>
                  <div className="summary-label">High Margin Items</div>
                  <div className="summary-detail">&gt;30% margin</div>
                </div>
              </div>
              <div className="summary-card warning">
                <div className="summary-icon">
                  <BarChart3 size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{lowMarginItems}</div>
                  <div className="summary-label">Low Margin Items</div>
                  <div className="summary-detail">&lt;10% margin</div>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3>Product Profitability</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Category</th>
                      <th>Cost Price</th>
                      <th>Selling Price</th>
                      <th>Profit per Unit</th>
                      <th>Margin %</th>
                      <th>Stock Quantity</th>
                      <th>Total Profit Potential</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitData.slice(0, 20).map((item) => (
                      <tr key={item.medicine.id}>
                        <td>{item.medicine.name}</td>
                        <td>
                          <span className={`category-badge ${item.medicine.category.toLowerCase()}`}>
                            {item.medicine.category}
                          </span>
                        </td>
                        <td>₹{item.costPrice}</td>
                        <td>₹{item.sellingPrice.toFixed(2)}</td>
                        <td>₹{item.profit.toFixed(2)}</td>
                        <td>
                          <span className={`margin-badge ${item.margin > 30 ? 'high' : item.margin > 15 ? 'medium' : 'low'}`}>
                            {item.margin.toFixed(1)}%
                          </span>
                        </td>
                        <td>{item.quantity}</td>
                        <td>₹{(item.profit * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'top-profitable':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Top 10 Most Profitable Products</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="medicine.name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Margin']} />
                  <Bar dataKey="margin" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="report-section">
              <h3>High Margin Products (&gt;30%)</h3>
              <div className="profit-grid">
                {profitData.filter(item => item.margin > 30).slice(0, 12).map((item) => (
                  <div key={item.medicine.id} className="profit-card">
                    <div className="profit-header">
                      <h4>{item.medicine.name}</h4>
                      <span className="margin-badge high">{item.margin.toFixed(1)}%</span>
                    </div>
                    <div className="profit-details">
                      <div className="profit-item">
                        <span>Cost:</span>
                        <span>₹{item.costPrice}</span>
                      </div>
                      <div className="profit-item">
                        <span>Selling:</span>
                        <span>₹{item.sellingPrice.toFixed(2)}</span>
                      </div>
                      <div className="profit-item">
                        <span>Profit:</span>
                        <span>₹{item.profit.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'low-margin':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Low Margin Products (&lt;10%)</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Category</th>
                      <th>Cost Price</th>
                      <th>Selling Price</th>
                      <th>Margin %</th>
                      <th>Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitData.filter(item => item.margin < 10).map((item) => (
                      <tr key={item.medicine.id} className="low-margin-row">
                        <td>{item.medicine.name}</td>
                        <td>
                          <span className={`category-badge ${item.medicine.category.toLowerCase()}`}>
                            {item.medicine.category}
                          </span>
                        </td>
                        <td>₹{item.costPrice}</td>
                        <td>₹{item.sellingPrice.toFixed(2)}</td>
                        <td>
                          <span className="margin-badge low">
                            {item.margin.toFixed(1)}%
                          </span>
                        </td>
                        <td>
                          <span className="recommendation">
                            {item.margin < 0 ? 'Review pricing - Loss making' : 
                             item.margin < 5 ? 'Increase price or find better supplier' :
                             'Consider price optimization'}
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
          <h2>Profitability Reports</h2>
          <p>Understand business health and high-margin products</p>
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

export default ProfitabilityReports;
