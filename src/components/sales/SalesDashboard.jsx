import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Receipt, 
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Clock,
  Target,
  CreditCard,
  Smartphone,
  Wallet,
  Banknote
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { format, startOfDay, endOfDay } from 'date-fns';
import { useSales } from '../../contexts/SalesContext';
import './SalesDashboard.css';

const SalesDashboard = () => {
  const { getDashboardMetrics, getMonthlySalesData, getRevenueByCategory, loading } = useSales();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const metrics = getDashboardMetrics();
  const monthlySalesData = getMonthlySalesData();
  const categoryData = getRevenueByCategory();

  // Auto refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // In real app, this would trigger data refresh
      console.log('Auto refreshing dashboard data...');
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const paymentMethodIcons = {
    'Cash': Banknote,
    'UPI': Smartphone,
    'Card': CreditCard,
    'Credit': Wallet
  };

  const handleExportDashboard = () => {
    // Export dashboard data as PDF
    console.log('Exporting dashboard...');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <RefreshCw className="spinning" size={32} />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="sales-dashboard">
      {/* Dashboard Controls */}
      <div className="dashboard-controls">
        <div className="period-selector">
          <label>Time Period:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        
        <div className="dashboard-actions">
          <button 
            className={`btn btn-outline ${autoRefresh ? 'active' : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw size={16} />
            Auto Refresh
          </button>
          <button className="btn btn-secondary" onClick={handleExportDashboard}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-header">
            <h3>Today's Revenue</h3>
            <DollarSign size={24} />
          </div>
          <div className="metric-value">₹{metrics.todayRevenue.toLocaleString()}</div>
          <div className="metric-change up">
            <TrendingUp size={16} />
            +12.5% from yesterday
          </div>
        </div>

        <div className="metric-card secondary">
          <div className="metric-header">
            <h3>Total Invoices</h3>
            <Receipt size={24} />
          </div>
          <div className="metric-value">{metrics.totalInvoices}</div>
          <div className="metric-change up">
            <TrendingUp size={16} />
            +8 from yesterday
          </div>
        </div>

        <div className="metric-card accent">
          <div className="metric-header">
            <h3>Average Sale</h3>
            <Target size={24} />
          </div>
          <div className="metric-value">
            ₹{metrics.totalInvoices > 0 ? Math.round(metrics.todayRevenue / metrics.totalInvoices) : 0}
          </div>
          <div className="metric-change up">
            <TrendingUp size={16} />
            +5.2% this month
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-header">
            <h3>Returns</h3>
            <RefreshCw size={24} />
          </div>
          <div className="metric-value">{metrics.totalReturns}</div>
          <div className="metric-change down">
            <TrendingUp size={16} />
            -2 from yesterday
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Monthly Sales Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Monthly Sales Trend</h3>
            <div className="chart-actions">
              <button className="btn-icon">
                <Filter size={16} />
              </button>
              <button className="btn-icon">
                <Download size={16} />
              </button>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Sales Count'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  fill="#2563eb" 
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue by Category</h3>
            <div className="chart-actions">
              <button className="btn-icon">
                <Download size={16} />
              </button>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="dashboard-bottom">
        {/* Payment Methods */}
        <div className="payment-methods-card">
          <h3>Today's Sales by Payment Method</h3>
          <div className="payment-methods">
            {Object.entries(metrics.paymentBreakdown).map(([method, amount]) => {
              const IconComponent = paymentMethodIcons[method] || CreditCard;
              const percentage = ((amount / metrics.todayRevenue) * 100).toFixed(1);
              
              return (
                <div key={method} className="payment-method">
                  <div className="payment-icon">
                    <IconComponent size={20} />
                  </div>
                  <div className="payment-details">
                    <div className="payment-method-name">{method}</div>
                    <div className="payment-amount">₹{amount.toLocaleString()}</div>
                    <div className="payment-percentage">{percentage}% of total</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Medicines */}
        <div className="top-medicines-card">
          <h3>Top Selling Medicines Today</h3>
          <div className="medicines-list">
            {metrics.topMedicines.map((medicine, index) => (
              <div key={medicine.name} className="medicine-item">
                <div className="medicine-rank">#{index + 1}</div>
                <div className="medicine-details">
                  <div className="medicine-name">{medicine.name}</div>
                  <div className="medicine-stats">
                    <span className="quantity">{medicine.quantity} units</span>
                    <span className="revenue">₹{medicine.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Updates Indicator */}
      <div className="live-indicator">
        <div className={`live-dot ${autoRefresh ? 'active' : ''}`}></div>
        <span>Live updates {autoRefresh ? 'enabled' : 'disabled'}</span>
        <Clock size={14} />
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default SalesDashboard;
