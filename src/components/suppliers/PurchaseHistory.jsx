import { useState } from 'react';
import { Search, Filter, TrendingUp, Package, Calendar } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useSuppliers } from '../../contexts/SupplierContext';

const PurchaseHistory = () => {
  const { purchaseOrders, suppliers, loading } = useSuppliers();
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [dateRange, setDateRange] = useState('30');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSupplierHistory = () => {
    const history = {};
    
    purchaseOrders.forEach(po => {
      if (!history[po.supplierId]) {
        const supplier = suppliers.find(s => s.id === po.supplierId);
        history[po.supplierId] = {
          supplier: supplier,
          orders: [],
          totalAmount: 0,
          totalOrders: 0,
          onTimeDeliveries: 0,
          delayedDeliveries: 0
        };
      }
      
      history[po.supplierId].orders.push(po);
      history[po.supplierId].totalAmount += po.totalAmount;
      history[po.supplierId].totalOrders += 1;
      
      if (po.actualDeliveryDate && po.expectedDeliveryDate) {
        if (new Date(po.actualDeliveryDate) <= new Date(po.expectedDeliveryDate)) {
          history[po.supplierId].onTimeDeliveries += 1;
        } else {
          history[po.supplierId].delayedDeliveries += 1;
        }
      }
    });
    
    return Object.values(history);
  };

  const supplierHistory = getSupplierHistory();

  if (loading) {
    return (
      <div className="supplier-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading purchase history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-container">
      <div className="supplier-section">
        <h3>Purchase History & Analytics</h3>
        <p>Track purchase patterns and supplier performance over time</p>
      </div>

      {/* Filters */}
      <div className="search-filter-section">
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          className="filter-select"
        >
          <option value="">All Suppliers</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        
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

      {/* Supplier History Cards */}
      <div className="history-list">
        {supplierHistory.map((history) => (
          <div key={history.supplier.id} className="history-card">
            <div className="history-header">
              <div>
                <h4>{history.supplier.name}</h4>
                <p>{history.supplier.supplierType} • {history.supplier.contactPerson}</p>
              </div>
              <div className="history-stats">
                <div className="stat-item">
                  <span className="stat-value">{history.totalOrders}</span>
                  <span className="stat-label">Orders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{formatCurrency(history.totalAmount)}</span>
                  <span className="stat-label">Total Value</span>
                </div>
              </div>
            </div>

            <div className="history-metrics">
              <div className="metric-item">
                <TrendingUp size={16} />
                <span>On-time Delivery: {Math.round((history.onTimeDeliveries / (history.onTimeDeliveries + history.delayedDeliveries)) * 100) || 0}%</span>
              </div>
              <div className="metric-item">
                <Package size={16} />
                <span>Average Order: {formatCurrency(history.totalAmount / history.totalOrders)}</span>
              </div>
              <div className="metric-item">
                <Calendar size={16} />
                <span>Last Order: {format(new Date(Math.max(...history.orders.map(o => new Date(o.orderDate)))), 'dd/MM/yyyy')}</span>
              </div>
            </div>

            <div className="recent-orders">
              <h5>Recent Orders</h5>
              {history.orders.slice(0, 3).map(order => (
                <div key={order.id} className="order-item">
                  <span className="order-id">{order.id}</span>
                  <span className="order-date">{format(new Date(order.orderDate), 'dd/MM/yyyy')}</span>
                  <span className="order-amount">{formatCurrency(order.totalAmount)}</span>
                  <span className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="history-summary">
        <div className="summary-card">
          <h4>Purchase Summary</h4>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">Total Suppliers</span>
              <span className="summary-value">{supplierHistory.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Orders</span>
              <span className="summary-value">{purchaseOrders.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Value</span>
              <span className="summary-value">
                {formatCurrency(purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0))}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Average Order Value</span>
              <span className="summary-value">
                {formatCurrency(purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0) / purchaseOrders.length)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
