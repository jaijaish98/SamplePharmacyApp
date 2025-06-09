import { useState } from 'react';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  Clock,
  Calendar,
  Target,
  DollarSign,
  Package,
  Users,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { useSales } from '../../contexts/SalesContext';

const RevenueAnalytics = () => {
  const { getRevenueByCategory, getMonthlySalesData } = useSales();
  const [selectedAnalysis, setSelectedAnalysis] = useState('category');

  const categoryData = getRevenueByCategory();
  const monthlyData = getMonthlySalesData();

  // Mock data for different analytics
  const hourlyData = [
    { hour: '8 AM', sales: 12, revenue: 4500 },
    { hour: '9 AM', sales: 18, revenue: 6200 },
    { hour: '10 AM', sales: 25, revenue: 8900 },
    { hour: '11 AM', sales: 32, revenue: 11200 },
    { hour: '12 PM', sales: 28, revenue: 9800 },
    { hour: '1 PM', sales: 22, revenue: 7600 },
    { hour: '2 PM', sales: 30, revenue: 10500 },
    { hour: '3 PM', sales: 35, revenue: 12300 },
    { hour: '4 PM', sales: 40, revenue: 14000 },
    { hour: '5 PM', sales: 38, revenue: 13200 },
    { hour: '6 PM', sales: 33, revenue: 11500 },
    { hour: '7 PM', sales: 25, revenue: 8700 },
    { hour: '8 PM', sales: 15, revenue: 5200 }
  ];

  const profitMarginData = [
    { category: 'OTC', revenue: 45000, cost: 32000, profit: 13000, margin: 28.9 },
    { category: 'Prescription', revenue: 38000, cost: 28000, profit: 10000, margin: 26.3 },
    { category: 'Supplements', revenue: 22000, cost: 15000, profit: 7000, margin: 31.8 },
    { category: 'Devices', revenue: 18000, cost: 12000, profit: 6000, margin: 33.3 }
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const analysisTypes = [
    { id: 'category', label: 'By Category', icon: Package },
    { id: 'hourly', label: 'By Hour', icon: Clock },
    { id: 'profit', label: 'Profit Analysis', icon: TrendingUp },
    { id: 'trends', label: 'Monthly Trends', icon: Calendar }
  ];

  const renderAnalysisContent = () => {
    switch (selectedAnalysis) {
      case 'category':
        return (
          <div className="analytics-content">
            <div className="chart-section">
              <h3>Revenue Distribution by Category</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="insights-section">
              <h4>Category Insights</h4>
              <div className="insights-list">
                {categoryData.map((category, index) => (
                  <div key={category.category} className="insight-item">
                    <div className="insight-color" style={{ backgroundColor: COLORS[index] }}></div>
                    <div className="insight-details">
                      <div className="insight-name">{category.category}</div>
                      <div className="insight-value">₹{category.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'hourly':
        return (
          <div className="analytics-content">
            <div className="chart-section">
              <h3>Sales Pattern by Hour of Day</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    fill="#2563eb" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="insights-section">
              <h4>Peak Hours Analysis</h4>
              <div className="peak-hours">
                <div className="peak-item">
                  <div className="peak-label">Peak Hour</div>
                  <div className="peak-value">4 PM - 5 PM</div>
                  <div className="peak-detail">₹14,000 revenue</div>
                </div>
                <div className="peak-item">
                  <div className="peak-label">Lowest Hour</div>
                  <div className="peak-value">8 AM - 9 AM</div>
                  <div className="peak-detail">₹4,500 revenue</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profit':
        return (
          <div className="analytics-content">
            <div className="chart-section">
              <h3>Profit Margin Analysis by Category</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={profitMarginData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
                  <Bar dataKey="profit" fill="#10b981" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="insights-section">
              <h4>Profitability Insights</h4>
              <div className="profit-metrics">
                {profitMarginData.map((item) => (
                  <div key={item.category} className="profit-item">
                    <div className="profit-category">{item.category}</div>
                    <div className="profit-margin">{item.margin}% margin</div>
                    <div className="profit-amount">₹{item.profit.toLocaleString()} profit</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'trends':
        return (
          <div className="analytics-content">
            <div className="chart-section">
              <h3>Monthly Revenue Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="insights-section">
              <h4>Trend Analysis</h4>
              <div className="trend-metrics">
                <div className="trend-item">
                  <div className="trend-label">Growth Rate</div>
                  <div className="trend-value positive">+12.5%</div>
                  <div className="trend-detail">vs last month</div>
                </div>
                <div className="trend-item">
                  <div className="trend-label">Best Month</div>
                  <div className="trend-value">Current</div>
                  <div className="trend-detail">Highest revenue</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="revenue-analytics">
      <div className="analytics-header">
        <div className="header-info">
          <h2>Revenue Analytics</h2>
          <p>Advanced analytics and insights into your pharmacy's revenue patterns</p>
        </div>
        <button className="btn btn-secondary">
          <Download size={16} />
          Export Analytics
        </button>
      </div>

      {/* Analysis Type Selector */}
      <div className="analysis-selector">
        {analysisTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.id}
              className={`analysis-btn ${selectedAnalysis === type.id ? 'active' : ''}`}
              onClick={() => setSelectedAnalysis(type.id)}
            >
              <IconComponent size={20} />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Analytics Content */}
      <div className="analytics-container">
        {renderAnalysisContent()}
      </div>

      {/* Key Metrics Summary */}
      <div className="metrics-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <DollarSign size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-value">₹1,23,000</div>
            <div className="summary-label">Total Revenue</div>
            <div className="summary-change positive">+15.2% this month</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <TrendingUp size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-value">28.5%</div>
            <div className="summary-label">Avg Profit Margin</div>
            <div className="summary-change positive">+2.1% improvement</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Users size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-value">1,247</div>
            <div className="summary-label">Total Customers</div>
            <div className="summary-change positive">+8.3% growth</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Target size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-value">₹356</div>
            <div className="summary-label">Avg Sale Value</div>
            <div className="summary-change positive">+5.7% increase</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
