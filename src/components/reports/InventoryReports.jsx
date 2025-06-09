import { useState } from 'react';
import { Download, Package, TrendingUp, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useReports } from '../../contexts/ReportsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const InventoryReports = () => {
  const { getInventoryReports, inventoryData, loading } = useReports();
  const [selectedReport, setSelectedReport] = useState('current-stock');
  const [filters, setFilters] = useState({
    category: '',
    supplier: '',
    location: '',
    status: ''
  });

  const inventoryReports = getInventoryReports();
  
  // Calculate inventory metrics
  const totalValue = inventoryReports.reduce((sum, item) => sum + item.totalValue, 0);
  const totalItems = inventoryReports.reduce((sum, item) => sum + item.totalQuantity, 0);
  const lowStockItems = inventoryReports.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = inventoryReports.filter(item => item.status === 'out-of-stock').length;

  // Category-wise distribution
  const categoryData = inventoryReports.reduce((acc, item) => {
    const category = item.medicine.category;
    if (!acc[category]) {
      acc[category] = { category, value: 0, quantity: 0 };
    }
    acc[category].value += item.totalValue;
    acc[category].quantity += item.totalQuantity;
    return acc;
  }, {});

  const categoryChartData = Object.values(categoryData);

  // Location-wise distribution
  const locationData = inventoryData.reduce((acc, item) => {
    const location = item.location;
    if (!acc[location]) {
      acc[location] = { location, value: 0, quantity: 0 };
    }
    acc[location].value += item.quantity * item.costPrice;
    acc[location].quantity += item.quantity;
    return acc;
  }, {});

  const locationChartData = Object.values(locationData);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const reportTypes = [
    { id: 'current-stock', label: 'Current Stock Summary', icon: Package },
    { id: 'valuation', label: 'Inventory Valuation Report', icon: TrendingUp },
    { id: 'movement', label: 'Stock Movement Report', icon: Calendar },
    { id: 'batch-wise', label: 'Batch-wise Stock Report', icon: Package },
    { id: 'location-wise', label: 'Location-wise Stock', icon: MapPin }
  ];

  const handleExport = (format) => {
    console.log(`Exporting ${selectedReport} report in ${format} format`);
  };

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading inventory data...</p>
        </div>
      );
    }

    switch (selectedReport) {
      case 'current-stock':
        return (
          <div className="report-content">
            <div className="inventory-summary">
              <div className="summary-card">
                <div className="summary-icon">
                  <Package size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{totalItems.toLocaleString()}</div>
                  <div className="summary-label">Total Items</div>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{totalValue.toLocaleString()}</div>
                  <div className="summary-label">Total Value</div>
                </div>
              </div>
              <div className="summary-card warning">
                <div className="summary-icon">
                  <Package size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{lowStockItems}</div>
                  <div className="summary-label">Low Stock Items</div>
                </div>
              </div>
              <div className="summary-card danger">
                <div className="summary-icon">
                  <Package size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{outOfStockItems}</div>
                  <div className="summary-label">Out of Stock</div>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3>Current Stock Details</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Category</th>
                      <th>Total Quantity</th>
                      <th>Total Value</th>
                      <th>Avg Cost Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryReports.slice(0, 20).map((item) => (
                      <tr key={item.medicine.id}>
                        <td>{item.medicine.name}</td>
                        <td>
                          <span className={`category-badge ${item.medicine.category.toLowerCase()}`}>
                            {item.medicine.category}
                          </span>
                        </td>
                        <td>{item.totalQuantity}</td>
                        <td>₹{item.totalValue.toLocaleString()}</td>
                        <td>₹{Math.round(item.totalValue / item.totalQuantity)}</td>
                        <td>
                          <span className={`status-badge ${item.status}`}>
                            {item.status.replace('-', ' ')}
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

      case 'valuation':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Inventory Valuation by Category</h3>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, value }) => `${category}: ₹${(value/1000).toFixed(0)}K`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="valuation-summary">
                    {categoryChartData.map((category, index) => (
                      <div key={category.category} className="valuation-item">
                        <div className="valuation-color" style={{ backgroundColor: COLORS[index] }}></div>
                        <div className="valuation-details">
                          <div className="valuation-category">{category.category}</div>
                          <div className="valuation-value">₹{category.value.toLocaleString()}</div>
                          <div className="valuation-quantity">{category.quantity} items</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3>Category-wise Valuation Details</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Items</th>
                      <th>Total Quantity</th>
                      <th>Total Value</th>
                      <th>Avg Value per Item</th>
                      <th>% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryChartData.map((category) => (
                      <tr key={category.category}>
                        <td>{category.category}</td>
                        <td>{inventoryReports.filter(item => item.medicine.category === category.category).length}</td>
                        <td>{category.quantity}</td>
                        <td>₹{category.value.toLocaleString()}</td>
                        <td>₹{Math.round(category.value / category.quantity)}</td>
                        <td>{((category.value / totalValue) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'batch-wise':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Batch-wise Stock Report</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Batch No</th>
                      <th>Expiry Date</th>
                      <th>Quantity</th>
                      <th>Cost Price</th>
                      <th>MRP</th>
                      <th>Location</th>
                      <th>Supplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.slice(0, 20).map((item) => (
                      <tr key={item.id}>
                        <td>{item.medicine.name}</td>
                        <td className="batch-no">{item.batchNo}</td>
                        <td>{format(new Date(item.expiryDate), 'dd/MM/yyyy')}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.costPrice}</td>
                        <td>₹{item.mrp}</td>
                        <td>{item.location}</td>
                        <td>{item.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'location-wise':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Location-wise Stock Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'value' ? `₹${value.toLocaleString()}` : value,
                    name === 'value' ? 'Value' : 'Quantity'
                  ]} />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="report-section">
              <h3>Location-wise Details</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Total Items</th>
                      <th>Total Quantity</th>
                      <th>Total Value</th>
                      <th>Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationChartData.map((location) => (
                      <tr key={location.location}>
                        <td>{location.location}</td>
                        <td>{inventoryData.filter(item => item.location === location.location).length}</td>
                        <td>{location.quantity}</td>
                        <td>₹{location.value.toLocaleString()}</td>
                        <td>
                          <div className="utilization-bar">
                            <div 
                              className="utilization-fill" 
                              style={{ width: `${Math.min((location.quantity / 500) * 100, 100)}%` }}
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
          <h2>Inventory Reports</h2>
          <p>Get a snapshot of current inventory, valuation, and movement</p>
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
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="otc">OTC</option>
            <option value="prescription">Prescription</option>
            <option value="supplements">Supplements</option>
            <option value="devices">Devices</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Supplier</label>
          <select
            value={filters.supplier}
            onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Suppliers</option>
            <option value="medplus">MedPlus Distributors</option>
            <option value="apollo">Apollo Pharmacy</option>
            <option value="cipla">Cipla Ltd</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Location</label>
          <select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Locations</option>
            <option value="shelf-a1">Shelf A1</option>
            <option value="shelf-a2">Shelf A2</option>
            <option value="cold-storage">Cold Storage</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
};

export default InventoryReports;
