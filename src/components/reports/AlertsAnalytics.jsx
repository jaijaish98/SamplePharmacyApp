import { useState } from 'react';
import { Bell, TrendingUp, Clock, AlertTriangle, Mail, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AlertsAnalytics = () => {
  const [selectedView, setSelectedView] = useState('analytics');

  // Mock analytics data
  const salesHeatmapData = [
    { hour: '8 AM', monday: 12, tuesday: 15, wednesday: 18, thursday: 14, friday: 22, saturday: 28, sunday: 8 },
    { hour: '10 AM', monday: 25, tuesday: 28, wednesday: 32, thursday: 30, friday: 35, saturday: 42, sunday: 18 },
    { hour: '12 PM', monday: 35, tuesday: 38, wednesday: 42, thursday: 40, friday: 45, saturday: 52, sunday: 25 },
    { hour: '2 PM', monday: 42, tuesday: 45, wednesday: 48, thursday: 46, friday: 50, saturday: 58, sunday: 32 },
    { hour: '4 PM', monday: 48, tuesday: 52, wednesday: 55, thursday: 53, friday: 58, saturday: 65, sunday: 38 },
    { hour: '6 PM', monday: 38, tuesday: 42, wednesday: 45, thursday: 43, friday: 48, saturday: 55, sunday: 28 },
    { hour: '8 PM', monday: 25, tuesday: 28, wednesday: 30, thursday: 28, friday: 32, saturday: 38, sunday: 15 }
  ];

  const productMovementData = [
    { product: 'Paracetamol', fastMoving: 245, slowMoving: 12, category: 'Fast' },
    { product: 'Amoxicillin', fastMoving: 189, slowMoving: 8, category: 'Fast' },
    { product: 'Vitamin D3', fastMoving: 156, slowMoving: 15, category: 'Medium' },
    { product: 'Cetirizine', fastMoving: 134, slowMoving: 6, category: 'Fast' },
    { product: 'Insulin Pen', fastMoving: 45, slowMoving: 89, category: 'Slow' },
    { product: 'BP Monitor', fastMoving: 23, slowMoving: 156, category: 'Slow' }
  ];

  const revenueExpenseData = [
    { month: 'Jan', revenue: 125000, expense: 89000 },
    { month: 'Feb', revenue: 132000, expense: 92000 },
    { month: 'Mar', revenue: 145000, expense: 98000 },
    { month: 'Apr', revenue: 138000, expense: 95000 },
    { month: 'May', revenue: 156000, expense: 102000 },
    { month: 'Jun', revenue: 148000, expense: 99000 }
  ];

  const alerts = [
    {
      id: 1,
      type: 'low-stock',
      severity: 'high',
      message: 'Paracetamol 500mg is running low (8 units remaining)',
      timestamp: new Date(),
      status: 'active'
    },
    {
      id: 2,
      type: 'expiry',
      severity: 'critical',
      message: '5 medicines expiring in next 7 days',
      timestamp: new Date(),
      status: 'active'
    },
    {
      id: 3,
      type: 'performance',
      severity: 'medium',
      message: 'Daily sales target achieved (102% of target)',
      timestamp: new Date(),
      status: 'resolved'
    },
    {
      id: 4,
      type: 'system',
      severity: 'low',
      message: 'Weekly backup completed successfully',
      timestamp: new Date(),
      status: 'resolved'
    }
  ];

  const viewTypes = [
    { id: 'analytics', label: 'Business Analytics', icon: TrendingUp },
    { id: 'alerts', label: 'Active Alerts', icon: AlertTriangle },
    { id: 'settings', label: 'Alert Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (selectedView) {
      case 'analytics':
        return (
          <div className="analytics-content">
            <div className="analytics-section">
              <h3>Sales Heatmap (Time of Day, Day of Week)</h3>
              <div className="heatmap-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesHeatmapData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="monday" stroke="#2563eb" strokeWidth={2} />
                    <Line type="monotone" dataKey="friday" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="saturday" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="sunday" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="heatmap-insights">
                <div className="insight-item">
                  <strong>Peak Hours:</strong> 4 PM - 6 PM on weekdays
                </div>
                <div className="insight-item">
                  <strong>Best Day:</strong> Saturday with highest sales volume
                </div>
                <div className="insight-item">
                  <strong>Slow Period:</strong> Sunday mornings and early weekday hours
                </div>
              </div>
            </div>

            <div className="analytics-section">
              <h3>Fast-moving vs. Slow-moving Products</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productMovementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="fastMoving" fill="#10b981" name="Fast Moving" />
                  <Bar dataKey="slowMoving" fill="#ef4444" name="Slow Moving" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-section">
              <h3>Revenue vs. Expense Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} name="Revenue" />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} name="Expense" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-section">
              <h3>Key Business Ratios</h3>
              <div className="ratios-grid">
                <div className="ratio-card">
                  <h4>Purchase to Sales Ratio</h4>
                  <div className="ratio-value">0.68</div>
                  <div className="ratio-detail">68% of purchases converted to sales</div>
                </div>
                <div className="ratio-card">
                  <h4>Inventory Turnover</h4>
                  <div className="ratio-value">8.2x</div>
                  <div className="ratio-detail">Inventory turns over 8.2 times per year</div>
                </div>
                <div className="ratio-card">
                  <h4>Customer Retention</h4>
                  <div className="ratio-value">73%</div>
                  <div className="ratio-detail">73% of customers make repeat purchases</div>
                </div>
                <div className="ratio-card">
                  <h4>Profit Margin</h4>
                  <div className="ratio-value">28.5%</div>
                  <div className="ratio-detail">Average profit margin across all products</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="alerts-content">
            <div className="alerts-summary">
              <div className="alert-stat critical">
                <div className="stat-value">{alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}</div>
                <div className="stat-label">Critical Alerts</div>
              </div>
              <div className="alert-stat high">
                <div className="stat-value">{alerts.filter(a => a.severity === 'high' && a.status === 'active').length}</div>
                <div className="stat-label">High Priority</div>
              </div>
              <div className="alert-stat medium">
                <div className="stat-value">{alerts.filter(a => a.severity === 'medium').length}</div>
                <div className="stat-label">Medium Priority</div>
              </div>
              <div className="alert-stat low">
                <div className="stat-value">{alerts.filter(a => a.severity === 'low').length}</div>
                <div className="stat-label">Low Priority</div>
              </div>
            </div>

            <div className="alerts-list">
              <h3>Active Alerts</h3>
              {alerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.severity} ${alert.status}`}>
                  <div className="alert-icon">
                    {alert.type === 'low-stock' && <AlertTriangle size={20} />}
                    {alert.type === 'expiry' && <Clock size={20} />}
                    {alert.type === 'performance' && <TrendingUp size={20} />}
                    {alert.type === 'system' && <Settings size={20} />}
                  </div>
                  <div className="alert-content">
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-meta">
                      <span className={`alert-severity ${alert.severity}`}>{alert.severity.toUpperCase()}</span>
                      <span className="alert-time">{alert.timestamp.toLocaleTimeString()}</span>
                      <span className={`alert-status ${alert.status}`}>{alert.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="alert-actions">
                    {alert.status === 'active' && (
                      <>
                        <button className="btn-small btn-primary">Resolve</button>
                        <button className="btn-small btn-outline">Snooze</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="settings-content">
            <div className="alert-settings">
              <h3>Alert Configuration</h3>
              
              <div className="setting-group">
                <h4>Stock Alerts</h4>
                <div className="setting-item">
                  <label>Low Stock Threshold</label>
                  <input type="number" defaultValue="10" className="setting-input" />
                  <span className="setting-unit">units</span>
                </div>
                <div className="setting-item">
                  <label>Critical Stock Threshold</label>
                  <input type="number" defaultValue="5" className="setting-input" />
                  <span className="setting-unit">units</span>
                </div>
              </div>

              <div className="setting-group">
                <h4>Expiry Alerts</h4>
                <div className="setting-item">
                  <label>Near Expiry Alert</label>
                  <input type="number" defaultValue="30" className="setting-input" />
                  <span className="setting-unit">days before expiry</span>
                </div>
                <div className="setting-item">
                  <label>Critical Expiry Alert</label>
                  <input type="number" defaultValue="7" className="setting-input" />
                  <span className="setting-unit">days before expiry</span>
                </div>
              </div>

              <div className="setting-group">
                <h4>Performance Alerts</h4>
                <div className="setting-item">
                  <label>Daily Sales Target</label>
                  <input type="number" defaultValue="50000" className="setting-input" />
                  <span className="setting-unit">₹</span>
                </div>
                <div className="setting-item">
                  <label>Weekly Performance Email</label>
                  <select className="setting-select">
                    <option value="monday">Every Monday</option>
                    <option value="friday">Every Friday</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="setting-group">
                <h4>Notification Preferences</h4>
                <div className="notification-options">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    Email notifications
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    In-app notifications
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    SMS notifications
                  </label>
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
    <div className="report-container">
      <div className="report-header">
        <div className="header-info">
          <h2>Alerts & Analytics</h2>
          <p>Data-driven business improvement and automated alerts</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Mail size={16} />
            Email Summary
          </button>
          <button className="btn btn-primary">
            <Bell size={16} />
            Configure Alerts
          </button>
        </div>
      </div>

      {/* View Type Selector */}
      <div className="report-types">
        {viewTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.id}
              className={`report-type-btn ${selectedView === type.id ? 'active' : ''}`}
              onClick={() => setSelectedView(type.id)}
            >
              <IconComponent size={20} />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default AlertsAnalytics;
