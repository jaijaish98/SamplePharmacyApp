import { useState } from 'react';
import { Download, Filter, Calendar, User, CreditCard, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SalesReports = () => {
  const [selectedReport, setSelectedReport] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [filters, setFilters] = useState({
    customer: '',
    product: '',
    brand: '',
    staff: '',
    paymentMode: ''
  });

  // Mock data for different reports
  const dailySalesData = [
    { date: '2024-01-15', revenue: 45280, invoices: 127, items: 342 },
    { date: '2024-01-14', revenue: 38950, invoices: 115, items: 298 },
    { date: '2024-01-13', revenue: 52100, invoices: 142, items: 387 },
    { date: '2024-01-12', revenue: 41200, invoices: 108, items: 276 },
    { date: '2024-01-11', revenue: 47800, invoices: 134, items: 356 }
  ];

  const paymentModeData = [
    { mode: 'Cash', amount: 125000, percentage: 45.5 },
    { mode: 'UPI', amount: 89000, percentage: 32.4 },
    { mode: 'Card', amount: 45000, percentage: 16.4 },
    { mode: 'Credit', amount: 15000, percentage: 5.7 }
  ];

  const topMedicinesData = [
    { name: 'Paracetamol 500mg', quantity: 245, revenue: 12250, category: 'OTC' },
    { name: 'Amoxicillin 250mg', quantity: 156, revenue: 15600, category: 'Prescription' },
    { name: 'Vitamin D3', quantity: 189, revenue: 9450, category: 'Supplements' },
    { name: 'Cetirizine 10mg', quantity: 134, revenue: 6700, category: 'OTC' },
    { name: 'Azithromycin 500mg', quantity: 98, revenue: 14700, category: 'Prescription' }
  ];

  const staffSalesData = [
    { staff: 'Dr. Sathya', invoices: 45, revenue: 125000, avgSale: 2778 },
    { staff: 'Pharmacist A', invoices: 38, revenue: 89000, avgSale: 2342 },
    { staff: 'Pharmacist B', invoices: 32, revenue: 67000, avgSale: 2094 },
    { staff: 'Cashier 1', invoices: 28, revenue: 45000, avgSale: 1607 }
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const reportTypes = [
    { id: 'daily', label: 'Daily Sales Report', icon: Calendar },
    { id: 'monthly', label: 'Monthly Sales Summary', icon: BarChart },
    { id: 'medicine', label: 'Sales by Medicine/Category', icon: FileText },
    { id: 'staff', label: 'Sales by User (Cashier-wise)', icon: User },
    { id: 'payment', label: 'Sales by Payment Mode', icon: CreditCard },
    { id: 'cancelled', label: 'Cancelled/Refunded Invoices', icon: FileText }
  ];

  const handleExport = (format) => {
    console.log(`Exporting ${selectedReport} report in ${format} format`);
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'daily':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Daily Sales Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : name === 'invoices' ? 'Invoices' : 'Items'
                  ]} />
                  <Bar dataKey="revenue" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="report-section">
              <h3>Daily Sales Summary</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Total Revenue</th>
                      <th>Invoices</th>
                      <th>Items Sold</th>
                      <th>Avg Sale Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailySalesData.map((day) => (
                      <tr key={day.date}>
                        <td>{format(new Date(day.date), 'dd/MM/yyyy')}</td>
                        <td>₹{day.revenue.toLocaleString()}</td>
                        <td>{day.invoices}</td>
                        <td>{day.items}</td>
                        <td>₹{Math.round(day.revenue / day.invoices)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Payment Mode Distribution</h3>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentModeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ mode, percentage }) => `${mode} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {paymentModeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="payment-summary">
                    {paymentModeData.map((payment, index) => (
                      <div key={payment.mode} className="payment-item">
                        <div className="payment-color" style={{ backgroundColor: COLORS[index] }}></div>
                        <div className="payment-details">
                          <div className="payment-mode">{payment.mode}</div>
                          <div className="payment-amount">₹{payment.amount.toLocaleString()}</div>
                          <div className="payment-percentage">{payment.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'medicine':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Top Selling Medicines</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Category</th>
                      <th>Quantity Sold</th>
                      <th>Revenue</th>
                      <th>Avg Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMedicinesData.map((medicine) => (
                      <tr key={medicine.name}>
                        <td>{medicine.name}</td>
                        <td>
                          <span className={`category-badge ${medicine.category.toLowerCase()}`}>
                            {medicine.category}
                          </span>
                        </td>
                        <td>{medicine.quantity}</td>
                        <td>₹{medicine.revenue.toLocaleString()}</td>
                        <td>₹{Math.round(medicine.revenue / medicine.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'staff':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Staff Performance</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Staff Member</th>
                      <th>Invoices</th>
                      <th>Total Revenue</th>
                      <th>Avg Sale Value</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffSalesData.map((staff) => (
                      <tr key={staff.staff}>
                        <td>{staff.staff}</td>
                        <td>{staff.invoices}</td>
                        <td>₹{staff.revenue.toLocaleString()}</td>
                        <td>₹{staff.avgSale}</td>
                        <td>
                          <div className="performance-bar">
                            <div 
                              className="performance-fill" 
                              style={{ width: `${(staff.revenue / 125000) * 100}%` }}
                            ></div>
                          </div>
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
          <h2>Sales Reports</h2>
          <p>Track billing activity, revenue trends, and performance metrics</p>
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
          <label>Date Range</label>
          <div className="date-range">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="filter-input"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="filter-input"
            />
          </div>
        </div>
        
        <div className="filter-group">
          <label>Customer</label>
          <input
            type="text"
            placeholder="Search customer..."
            value={filters.customer}
            onChange={(e) => setFilters(prev => ({ ...prev, customer: e.target.value }))}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Payment Mode</label>
          <select
            value={filters.paymentMode}
            onChange={(e) => setFilters(prev => ({ ...prev, paymentMode: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Methods</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="credit">Credit</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Staff</label>
          <select
            value={filters.staff}
            onChange={(e) => setFilters(prev => ({ ...prev, staff: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Staff</option>
            <option value="dr-sathya">Dr. Sathya</option>
            <option value="pharmacist-a">Pharmacist A</option>
            <option value="pharmacist-b">Pharmacist B</option>
          </select>
        </div>
      </div>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
};

export default SalesReports;
