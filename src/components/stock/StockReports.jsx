import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Calendar, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { useStock } from '../../contexts/StockContext';

const StockReports = () => {
  const { stockItems, getStockAnalytics, loading } = useStock();
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  const analytics = getStockAnalytics();

  // Mock data for charts
  const categoryData = [
    { name: 'Tablets', value: 45, stock: 1250 },
    { name: 'Capsules', value: 25, stock: 680 },
    { name: 'Syrups', value: 15, stock: 420 },
    { name: 'Injections', value: 10, stock: 280 },
    { name: 'Others', value: 5, stock: 140 }
  ];

  const stockTrendData = [
    { month: 'Jan', opening: 1200, closing: 1180, purchases: 500, sales: 520 },
    { month: 'Feb', opening: 1180, closing: 1220, purchases: 600, sales: 560 },
    { month: 'Mar', opening: 1220, closing: 1200, purchases: 550, sales: 570 },
    { month: 'Apr', opening: 1200, closing: 1250, purchases: 650, sales: 600 },
    { month: 'May', opening: 1250, closing: 1280, purchases: 580, sales: 550 }
  ];

  const topMovingItems = stockItems
    .sort((a, b) => (b.maxStock - b.currentStock) - (a.maxStock - a.currentStock))
    .slice(0, 10);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const generateReport = (type) => {
    // In a real app, this would generate and download actual reports
    alert(`Generating ${type} report...`);
  };

  const renderSummaryReport = () => (
    <div className="report-content">
      <div className="report-header">
        <h4>Stock Summary Report</h4>
        <div className="report-date">
          As of {format(new Date(), 'dd/MM/yyyy HH:mm')}
        </div>
      </div>

      <div className="summary-metrics">
        <div className="metric-card">
          <div className="metric-value">{analytics.totalItems}</div>
          <div className="metric-label">Total Items</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(analytics.totalValue)}</div>
          <div className="metric-label">Total Stock Value</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{analytics.lowStock}</div>
          <div className="metric-label">Low Stock Items</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{analytics.outOfStock}</div>
          <div className="metric-label">Out of Stock</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h5>Stock Distribution by Category</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h5>Stock Movement Trend</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="purchases" fill="#10b981" name="Purchases" />
              <Bar dataKey="sales" fill="#ef4444" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderItemWiseReport = () => (
    <div className="report-content">
      <div className="report-header">
        <h4>Item-wise Stock Report</h4>
        <div className="report-filters">
          <select className="filter-select">
            <option>All Categories</option>
            <option>Tablets</option>
            <option>Capsules</option>
            <option>Syrups</option>
          </select>
        </div>
      </div>

      <div className="item-report-table">
        <table className="report-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Stock Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.slice(0, 15).map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.currentStock}</td>
                <td>{item.reorderLevel}</td>
                <td>{formatCurrency(item.currentStock * item.costPrice)}</td>
                <td>
                  <span className={`status-badge ${item.isOutOfStock ? 'out-of-stock' : item.isLowStock ? 'low-stock' : 'in-stock'}`}>
                    {item.isOutOfStock ? 'Out of Stock' : item.isLowStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStockHistoryReport = () => (
    <div className="report-content">
      <div className="report-header">
        <h4>Stock History Report</h4>
        <div className="date-range">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="date-input"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="date-input"
          />
        </div>
      </div>

      <div className="history-summary">
        <div className="summary-card">
          <h5>Opening Stock</h5>
          <div className="summary-value">{formatCurrency(1200000)}</div>
        </div>
        <div className="summary-card">
          <h5>Purchases</h5>
          <div className="summary-value positive">{formatCurrency(450000)}</div>
        </div>
        <div className="summary-card">
          <h5>Sales</h5>
          <div className="summary-value negative">{formatCurrency(380000)}</div>
        </div>
        <div className="summary-card">
          <h5>Closing Stock</h5>
          <div className="summary-value">{formatCurrency(1270000)}</div>
        </div>
      </div>

      <div className="top-movers">
        <h5>Top Moving Items</h5>
        <div className="movers-list">
          {topMovingItems.map((item, index) => (
            <div key={item.id} className="mover-item">
              <div className="mover-rank">#{index + 1}</div>
              <div className="mover-info">
                <div className="mover-name">{item.name}</div>
                <div className="mover-movement">
                  Moved: {item.maxStock - item.currentStock} units
                </div>
              </div>
              <div className="mover-value">
                {formatCurrency((item.maxStock - item.currentStock) * item.costPrice)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="stock-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading stock reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-container">
      <div className="stock-section">
        <div className="section-header">
          <h3>Stock Reports & Analytics</h3>
          <div className="report-actions">
            <button 
              className="btn btn-primary"
              onClick={() => generateReport(reportType)}
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="report-tabs">
        <button 
          className={`report-tab ${reportType === 'summary' ? 'active' : ''}`}
          onClick={() => setReportType('summary')}
        >
          <FileText size={16} />
          Stock Summary
        </button>
        <button 
          className={`report-tab ${reportType === 'itemwise' ? 'active' : ''}`}
          onClick={() => setReportType('itemwise')}
        >
          <Package size={16} />
          Item-wise Report
        </button>
        <button 
          className={`report-tab ${reportType === 'history' ? 'active' : ''}`}
          onClick={() => setReportType('history')}
        >
          <TrendingUp size={16} />
          Stock History
        </button>
      </div>

      {/* Report Content */}
      <div className="stock-section">
        {reportType === 'summary' && renderSummaryReport()}
        {reportType === 'itemwise' && renderItemWiseReport()}
        {reportType === 'history' && renderStockHistoryReport()}
      </div>

      {/* Quick Export Options */}
      <div className="export-options">
        <h4>Quick Export Options</h4>
        <div className="export-buttons">
          <button 
            className="btn btn-outline"
            onClick={() => generateReport('daily-summary')}
          >
            <Calendar size={16} />
            Daily Summary
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => generateReport('low-stock')}
          >
            <AlertTriangle size={16} />
            Low Stock Report
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => generateReport('valuation')}
          >
            <TrendingUp size={16} />
            Stock Valuation
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => generateReport('movement')}
          >
            <Package size={16} />
            Movement Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockReports;
