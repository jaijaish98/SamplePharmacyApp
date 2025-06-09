import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { usePrescriptions } from '../../contexts/PrescriptionContext';

const PrescriptionAnalytics = () => {
  const { getPrescriptionAnalytics } = usePrescriptions();
  const [dateRange, setDateRange] = useState('30');

  const analytics = getPrescriptionAnalytics();

  // Mock analytics data
  const validationTrend = [
    { month: 'Jan', uploaded: 45, approved: 42, rejected: 3 },
    { month: 'Feb', uploaded: 52, approved: 48, rejected: 4 },
    { month: 'Mar', uploaded: 38, approved: 35, rejected: 3 },
    { month: 'Apr', uploaded: 61, approved: 56, rejected: 5 },
    { month: 'May', uploaded: 47, approved: 44, rejected: 3 }
  ];

  const scheduleDistribution = [
    { name: 'OTC', value: 120, color: '#10b981' },
    { name: 'Schedule H', value: 85, color: '#f59e0b' },
    { name: 'Schedule H1', value: 32, color: '#ef4444' },
    { name: 'Schedule X', value: 10, color: '#8b5cf6' }
  ];

  const doctorStats = [
    { doctor: 'Dr. Sharma', prescriptions: 45, approvalRate: 95 },
    { doctor: 'Dr. Patel', prescriptions: 38, approvalRate: 92 },
    { doctor: 'Dr. Singh', prescriptions: 32, approvalRate: 97 },
    { doctor: 'Dr. Reddy', prescriptions: 28, approvalRate: 89 },
    { doctor: 'Dr. Gupta', prescriptions: 25, approvalRate: 94 }
  ];

  const fulfillmentMetrics = [
    { metric: 'Average Fulfillment Time', value: '2.3 hours', trend: 'down' },
    { metric: 'Partial Fulfillment Rate', value: '15%', trend: 'up' },
    { metric: 'Stock-out Impact', value: '8%', trend: 'down' },
    { metric: 'Customer Satisfaction', value: '94%', trend: 'up' }
  ];

  return (
    <div className="prescription-container">
      <div className="prescription-section">
        <div className="section-header">
          <div>
            <h3>Prescription Analytics</h3>
            <p>Comprehensive insights into prescription management performance</p>
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
      </div>

      {/* Key Metrics */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-icon">
            <FileText size={24} />
          </div>
          <div className="analytics-content">
            <div className="analytics-value">{analytics.total}</div>
            <div className="analytics-label">Total Prescriptions</div>
            <div className="analytics-change up">+12% from last month</div>
          </div>
        </div>
        
        <div className="analytics-card">
          <div className="analytics-icon">
            <CheckCircle size={24} />
          </div>
          <div className="analytics-content">
            <div className="analytics-value">{analytics.approvalRate}%</div>
            <div className="analytics-label">Approval Rate</div>
            <div className="analytics-change up">+2% from last month</div>
          </div>
        </div>
        
        <div className="analytics-card">
          <div className="analytics-icon">
            <Clock size={24} />
          </div>
          <div className="analytics-content">
            <div className="analytics-value">{analytics.fulfillmentRate}%</div>
            <div className="analytics-label">Fulfillment Rate</div>
            <div className="analytics-change up">+5% from last month</div>
          </div>
        </div>
        
        <div className="analytics-card">
          <div className="analytics-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="analytics-content">
            <div className="analytics-value">{analytics.restrictedMeds}</div>
            <div className="analytics-label">Restricted Medicines</div>
            <div className="analytics-change">Requiring validation</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        <div className="chart-section">
          <h4>Prescription Validation Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={validationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uploaded" stroke="#2563eb" strokeWidth={2} name="Uploaded" />
              <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Approved" />
              <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="Rejected" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h4>Medicine Schedule Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scheduleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {scheduleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Doctor Performance */}
      <div className="prescription-section">
        <h4>Top Prescribing Doctors</h4>
        <div className="doctor-performance">
          {doctorStats.map((doctor, index) => (
            <div key={doctor.doctor} className="doctor-card">
              <div className="doctor-rank">#{index + 1}</div>
              <div className="doctor-info">
                <div className="doctor-name">{doctor.doctor}</div>
                <div className="doctor-stats">
                  <span>{doctor.prescriptions} prescriptions</span>
                  <span>{doctor.approvalRate}% approval rate</span>
                </div>
              </div>
              <div className="doctor-chart">
                <div className="approval-bar">
                  <div 
                    className="approval-fill" 
                    style={{ width: `${doctor.approvalRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fulfillment Metrics */}
      <div className="prescription-section">
        <h4>Fulfillment Performance</h4>
        <div className="fulfillment-metrics">
          {fulfillmentMetrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <span className="metric-label">{metric.metric}</span>
                <span className={`metric-trend ${metric.trend}`}>
                  <TrendingUp size={14} />
                </span>
              </div>
              <div className="metric-value">{metric.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Summary */}
      <div className="prescription-section">
        <h4>Compliance Summary</h4>
        <div className="compliance-summary">
          <div className="compliance-item">
            <div className="compliance-icon success">
              <CheckCircle size={20} />
            </div>
            <div className="compliance-content">
              <div className="compliance-title">Doctor Registration Verified</div>
              <div className="compliance-description">All prescribing doctors have valid registrations</div>
            </div>
          </div>
          
          <div className="compliance-item">
            <div className="compliance-icon warning">
              <AlertTriangle size={20} />
            </div>
            <div className="compliance-content">
              <div className="compliance-title">Restricted Medicine Tracking</div>
              <div className="compliance-description">{analytics.restrictedMeds} prescriptions contain restricted medicines</div>
            </div>
          </div>
          
          <div className="compliance-item">
            <div className="compliance-icon success">
              <FileText size={20} />
            </div>
            <div className="compliance-content">
              <div className="compliance-title">Record Retention</div>
              <div className="compliance-description">All prescriptions stored for minimum 2 years</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="prescription-section">
        <h4>Key Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <h5>Validation Efficiency</h5>
            <p>Average validation time has decreased by 15% this month, improving overall prescription processing speed.</p>
          </div>
          
          <div className="insight-card">
            <h5>Stock Management</h5>
            <p>8% of prescriptions face partial fulfillment due to stock-outs. Consider inventory optimization for high-demand medicines.</p>
          </div>
          
          <div className="insight-card">
            <h5>Compliance Score</h5>
            <p>Maintaining 98% compliance rate for restricted medicine handling and documentation requirements.</p>
          </div>
          
          <div className="insight-card">
            <h5>Customer Satisfaction</h5>
            <p>94% customer satisfaction rate for prescription services, with quick validation being the top-rated feature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionAnalytics;
