import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Package, Clock, Star, Award } from 'lucide-react';
import { useSuppliers } from '../../contexts/SupplierContext';

const SupplierAnalytics = () => {
  const { getSupplierAnalytics, suppliers, purchaseOrders } = useSuppliers();
  const [dateRange, setDateRange] = useState('90');

  const analytics = getSupplierAnalytics();

  // Mock analytics data
  const supplierPerformance = suppliers.slice(0, 5).map(supplier => ({
    name: supplier.name.split(' ')[0],
    volume: supplier.totalPurchases / 1000,
    onTime: supplier.onTimeDeliveryRate,
    rating: supplier.rating
  }));

  const deliveryTrends = [
    { month: 'Jan', onTime: 92, delayed: 8 },
    { month: 'Feb', onTime: 88, delayed: 12 },
    { month: 'Mar', onTime: 94, delayed: 6 },
    { month: 'Apr', onTime: 91, delayed: 9 },
    { month: 'May', onTime: 96, delayed: 4 }
  ];

  const supplierTypes = [
    { name: 'Wholesaler', value: 15, color: '#2563eb' },
    { name: 'Manufacturer', value: 8, color: '#10b981' },
    { name: 'Local', value: 5, color: '#f59e0b' }
  ];

  const topSuppliers = suppliers
    .sort((a, b) => b.totalPurchases - a.totalPurchases)
    .slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="supplier-container">
      <div className="supplier-section">
        <div className="section-header">
          <div>
            <h3>Supplier Performance Analytics</h3>
            <p>Comprehensive insights into supplier performance and procurement metrics</p>
          </div>
          <div className="header-filters">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
            >
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="180">Last 6 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-icon">
            <Package size={24} />
          </div>
          <div className="analytics-content">
            <div className="analytics-value">{analytics.totalSuppliers}</div>
            <div className="analytics-label">Total Suppliers</div>
            <div className="analytics-change up">+3 this month</div>
          </div>
        </div>
        
        <div className="analytics-card">
          <div className="analytics-icon">
            <TrendingUp size={24} />
          </div>
          <div className="analytics-content">
            <div className="analytics-value">{formatCurrency(analytics.totalPurchaseValue)}</div>
            <div className="analytics-label">Total Purchase Value</div>
            <div className="analytics-change up">+15% from last quarter</div>
          </div>
        </div>
        
        <div className="analytics-card">
          <div className="analytics-icon">
            <Clock size={24} />
          </div>
          <div className="analytics-content">
            <div className="analytics-value">{analytics.onTimeDeliveryRate}%</div>
            <div className="analytics-label">On-time Delivery Rate</div>
            <div className="analytics-change up">+3% improvement</div>
          </div>
        </div>
        
        <div className="analytics-card">
          <div className="analytics-icon">
            <Star size={24} />
          </div>
          <div className="analytics-content">
            <div className="analytics-value">{analytics.averageRating}</div>
            <div className="analytics-label">Average Rating</div>
            <div className="analytics-change up">+0.2 from last month</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        <div className="chart-section">
          <h4>Supplier Performance by Volume</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplierPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'volume' ? `₹${value}K` : `${value}%`,
                name === 'volume' ? 'Purchase Volume' : 'On-time Delivery'
              ]} />
              <Bar dataKey="volume" fill="#2563eb" name="volume" />
              <Bar dataKey="onTime" fill="#10b981" name="onTime" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h4>Delivery Performance Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={deliveryTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={2} name="On-time %" />
              <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={2} name="Delayed %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h4>Supplier Type Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={supplierTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {supplierTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Suppliers */}
      <div className="supplier-section">
        <h4>Top Suppliers by Purchase Volume</h4>
        <div className="top-suppliers">
          {topSuppliers.map((supplier, index) => (
            <div key={supplier.id} className="supplier-rank-card">
              <div className="rank-badge">#{index + 1}</div>
              <div className="supplier-info">
                <div className="supplier-name">{supplier.name}</div>
                <div className="supplier-type">{supplier.supplierType}</div>
              </div>
              <div className="supplier-metrics">
                <div className="metric-item">
                  <span className="metric-value">{formatCurrency(supplier.totalPurchases)}</span>
                  <span className="metric-label">Total Purchase</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">{supplier.totalOrders}</span>
                  <span className="metric-label">Orders</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">{supplier.onTimeDeliveryRate}%</span>
                  <span className="metric-label">On-time</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">{supplier.rating}</span>
                  <span className="metric-label">Rating</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="supplier-section">
        <h4>Performance Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon success">
              <Award size={20} />
            </div>
            <div className="insight-content">
              <h5>Best Performing Supplier</h5>
              <p>{topSuppliers[0]?.name} leads with {topSuppliers[0]?.onTimeDeliveryRate}% on-time delivery and {topSuppliers[0]?.rating} rating.</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon warning">
              <Clock size={20} />
            </div>
            <div className="insight-content">
              <h5>Delivery Performance</h5>
              <p>Overall on-time delivery rate is {analytics.onTimeDeliveryRate}%, showing consistent improvement over the last quarter.</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon info">
              <TrendingUp size={20} />
            </div>
            <div className="insight-content">
              <h5>Purchase Volume Growth</h5>
              <p>Total purchase volume has increased by 15% compared to the previous quarter, indicating business growth.</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon success">
              <Star size={20} />
            </div>
            <div className="insight-content">
              <h5>Supplier Quality</h5>
              <p>Average supplier rating is {analytics.averageRating}, with {suppliers.filter(s => s.rating >= 4.0).length} suppliers rated 4.0 or above.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="supplier-section">
        <h4>Recommendations</h4>
        <div className="recommendations">
          <div className="recommendation-item">
            <div className="recommendation-priority high">High</div>
            <div className="recommendation-content">
              <h5>Diversify Supplier Base</h5>
              <p>Consider adding more local suppliers to reduce dependency on top 3 suppliers who account for 70% of purchases.</p>
            </div>
          </div>
          
          <div className="recommendation-item">
            <div className="recommendation-priority medium">Medium</div>
            <div className="recommendation-content">
              <h5>Improve Payment Terms</h5>
              <p>Negotiate better payment terms with high-volume suppliers to improve cash flow management.</p>
            </div>
          </div>
          
          <div className="recommendation-item">
            <div className="recommendation-priority low">Low</div>
            <div className="recommendation-content">
              <h5>Performance Reviews</h5>
              <p>Schedule quarterly performance reviews with suppliers rated below 3.5 to address quality issues.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierAnalytics;
