import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useCustomers } from '../../contexts/CustomerContext';

const CustomerAnalytics = () => {
  const { getCustomerAnalytics } = useCustomers();
  const [dateRange, setDateRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const analytics = getCustomerAnalytics();

  // Mock analytics data
  const genderDistribution = [
    { name: 'Male', value: 652, color: '#2563eb' },
    { name: 'Female', value: 595, color: '#10b981' }
  ];

  const ageGroupDistribution = [
    { ageGroup: '18-30', customers: 245, percentage: 19.6 },
    { ageGroup: '31-45', customers: 387, percentage: 31.0 },
    { ageGroup: '46-60', customers: 423, percentage: 33.9 },
    { ageGroup: '60+', customers: 192, percentage: 15.4 }
  ];

  const customerGrowth = [
    { month: 'Jan', newCustomers: 45, totalCustomers: 1050 },
    { month: 'Feb', newCustomers: 52, totalCustomers: 1102 },
    { month: 'Mar', newCustomers: 38, totalCustomers: 1140 },
    { month: 'Apr', newCustomers: 61, totalCustomers: 1201 },
    { month: 'May', newCustomers: 46, totalCustomers: 1247 }
  ];

  const topSpendingCustomers = [
    { name: 'Rajesh Kumar', totalSpent: 45230, visits: 23 },
    { name: 'Priya Sharma', totalSpent: 38950, visits: 19 },
    { name: 'Amit Patel', totalSpent: 32100, visits: 16 },
    { name: 'Sunita Devi', totalSpent: 28750, visits: 21 },
    { name: 'Ravi Gupta', totalSpent: 25600, visits: 14 }
  ];

  const customerSegments = [
    { segment: 'VIP Customers', count: 89, revenue: 892000, avgSpent: 10022 },
    { segment: 'Regular Customers', count: 456, revenue: 1245000, avgSpent: 2730 },
    { segment: 'Occasional Customers', count: 702, revenue: 856000, avgSpent: 1219 }
  ];

  const metrics = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'demographics', label: 'Demographics', icon: BarChart },
    { id: 'behavior', label: 'Purchase Behavior', icon: TrendingUp },
    { id: 'segments', label: 'Customer Segments', icon: Filter }
  ];

  const renderOverview = () => (
    <div className="analytics-overview">
      <div className="analytics-stats">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{analytics.totalCustomers}</div>
            <div className="stat-label">Total Customers</div>
            <div className="stat-change up">+{analytics.newCustomersThisMonth} this month</div>
          </div>
        </div>
        
        <div className="stat-card secondary">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{analytics.activeCustomers}</div>
            <div className="stat-label">Active Customers</div>
            <div className="stat-change up">{analytics.retentionRate}% retention</div>
          </div>
        </div>
        
        <div className="stat-card accent">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">₹{analytics.totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-change up">From all customers</div>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{analytics.repeatCustomers}</div>
            <div className="stat-label">Repeat Customers</div>
            <div className="stat-change up">{Math.round((analytics.repeatCustomers / analytics.totalCustomers) * 100)}% of total</div>
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-section">
          <h4>Customer Growth Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="newCustomers" stroke="#2563eb" strokeWidth={2} name="New Customers" />
              <Line type="monotone" dataKey="totalCustomers" stroke="#10b981" strokeWidth={2} name="Total Customers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderDemographics = () => (
    <div className="analytics-demographics">
      <div className="demographics-charts">
        <div className="chart-section">
          <h4>Gender Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h4>Age Group Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageGroupDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="customers" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="demographics-table">
        <h4>Age Group Breakdown</h4>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Age Group</th>
              <th>Customers</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {ageGroupDistribution.map((group) => (
              <tr key={group.ageGroup}>
                <td>{group.ageGroup}</td>
                <td>{group.customers}</td>
                <td>{group.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBehavior = () => (
    <div className="analytics-behavior">
      <div className="behavior-section">
        <h4>Top Spending Customers</h4>
        <div className="top-customers">
          {topSpendingCustomers.map((customer, index) => (
            <div key={customer.name} className="customer-row">
              <div className="customer-rank">#{index + 1}</div>
              <div className="customer-info">
                <div className="customer-name">{customer.name}</div>
                <div className="customer-stats">
                  <span>₹{customer.totalSpent.toLocaleString()}</span>
                  <span>{customer.visits} visits</span>
                </div>
              </div>
              <div className="customer-bar">
                <div 
                  className="customer-fill" 
                  style={{ width: `${(customer.totalSpent / topSpendingCustomers[0].totalSpent) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="behavior-metrics">
        <div className="metric-card">
          <h5>Average Order Value</h5>
          <div className="metric-value">₹2,450</div>
          <div className="metric-change up">+12% from last month</div>
        </div>
        
        <div className="metric-card">
          <h5>Purchase Frequency</h5>
          <div className="metric-value">3.2</div>
          <div className="metric-change">visits per month</div>
        </div>
        
        <div className="metric-card">
          <h5>Customer Lifetime Value</h5>
          <div className="metric-value">₹18,500</div>
          <div className="metric-change up">+8% from last quarter</div>
        </div>
      </div>
    </div>
  );

  const renderSegments = () => (
    <div className="analytics-segments">
      <div className="segments-overview">
        <h4>Customer Segments</h4>
        <div className="segments-grid">
          {customerSegments.map((segment) => (
            <div key={segment.segment} className="segment-card">
              <h5>{segment.segment}</h5>
              <div className="segment-stats">
                <div className="segment-stat">
                  <span className="stat-value">{segment.count}</span>
                  <span className="stat-label">Customers</span>
                </div>
                <div className="segment-stat">
                  <span className="stat-value">₹{(segment.revenue / 1000).toFixed(0)}K</span>
                  <span className="stat-label">Revenue</span>
                </div>
                <div className="segment-stat">
                  <span className="stat-value">₹{segment.avgSpent.toLocaleString()}</span>
                  <span className="stat-label">Avg Spent</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="segment-analysis">
        <h4>Segment Performance</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={customerSegments}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="segment" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="customer-container">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h3>Customer Analytics</h3>
          <p>Comprehensive insights into customer behavior and trends</p>
        </div>
        <div className="header-filters">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="analytics-tabs">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <button
              key={metric.id}
              className={`tab-btn ${selectedMetric === metric.id ? 'active' : ''}`}
              onClick={() => setSelectedMetric(metric.id)}
            >
              <IconComponent size={16} />
              {metric.label}
            </button>
          );
        })}
      </div>

      {/* Analytics Content */}
      <div className="analytics-content">
        {selectedMetric === 'overview' && renderOverview()}
        {selectedMetric === 'demographics' && renderDemographics()}
        {selectedMetric === 'behavior' && renderBehavior()}
        {selectedMetric === 'segments' && renderSegments()}
      </div>
    </div>
  );
};

export default CustomerAnalytics;
