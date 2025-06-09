import { useState } from 'react';
import { Package, AlertTriangle, TrendingUp, Calendar, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useStock } from '../../contexts/StockContext';

const StockOverview = () => {
  const { 
    getFilteredStockItems, 
    getStockAnalytics, 
    getLowStockItems, 
    getOutOfStockItems, 
    getNearExpiryItems,
    loading 
  } = useStock();

  const [viewMode, setViewMode] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const analytics = getStockAnalytics();
  const allItems = getFilteredStockItems();
  const lowStockItems = getLowStockItems();
  const outOfStockItems = getOutOfStockItems();
  const nearExpiryItems = getNearExpiryItems();

  const getDisplayItems = () => {
    switch (viewMode) {
      case 'low_stock':
        return lowStockItems;
      case 'out_of_stock':
        return outOfStockItems;
      case 'near_expiry':
        return nearExpiryItems;
      default:
        return allItems.slice(0, 20); // Show first 20 items
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatusBadge = (item) => {
    if (item.isOutOfStock) {
      return { class: 'out-of-stock', label: 'Out of Stock', icon: AlertTriangle };
    } else if (item.isLowStock) {
      return { class: 'low-stock', label: 'Low Stock', icon: AlertTriangle };
    } else {
      return { class: 'in-stock', label: 'In Stock', icon: Package };
    }
  };

  const getExpiryStatusBadge = (item) => {
    if (item.daysToExpiry < 0) {
      return { class: 'expired', label: 'Expired', color: '#ef4444' };
    } else if (item.isNearExpiry) {
      return { class: 'near-expiry', label: `${item.daysToExpiry} days left`, color: '#f59e0b' };
    } else {
      return { class: 'valid', label: `${item.daysToExpiry} days left`, color: '#10b981' };
    }
  };

  if (loading) {
    return (
      <div className="stock-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading stock overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-container">
      {/* Analytics Cards */}
      <div className="stock-analytics">
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-icon">
              <Package size={24} />
            </div>
            <div className="analytics-content">
              <div className="analytics-value">{analytics.totalItems}</div>
              <div className="analytics-label">Total Items</div>
              <div className="analytics-detail">Across all categories</div>
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="analytics-icon">
              <TrendingUp size={24} />
            </div>
            <div className="analytics-content">
              <div className="analytics-value">{analytics.inStock}</div>
              <div className="analytics-label">In Stock</div>
              <div className="analytics-detail">Above reorder level</div>
            </div>
          </div>
          
          <div className="analytics-card warning">
            <div className="analytics-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="analytics-content">
              <div className="analytics-value">{analytics.lowStock}</div>
              <div className="analytics-label">Low Stock</div>
              <div className="analytics-detail">Need reordering</div>
            </div>
          </div>
          
          <div className="analytics-card danger">
            <div className="analytics-icon">
              <Package size={24} />
            </div>
            <div className="analytics-content">
              <div className="analytics-value">{analytics.outOfStock}</div>
              <div className="analytics-label">Out of Stock</div>
              <div className="analytics-detail">Immediate attention</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Value Summary */}
      <div className="stock-section">
        <h3>Stock Value Summary</h3>
        <div className="value-summary">
          <div className="value-card">
            <div className="value-label">Total Stock Value (Cost)</div>
            <div className="value-amount">{formatCurrency(analytics.totalValue)}</div>
          </div>
          <div className="value-card">
            <div className="value-label">Total Stock Value (MRP)</div>
            <div className="value-amount">{formatCurrency(analytics.totalMRP)}</div>
          </div>
          <div className="value-card">
            <div className="value-label">Potential Profit</div>
            <div className="value-amount profit">{formatCurrency(analytics.totalMRP - analytics.totalValue)}</div>
          </div>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="stock-section">
        <div className="section-header">
          <h3>Stock Items</h3>
          <div className="view-controls">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="view-select"
            >
              <option value="all">All Items</option>
              <option value="low_stock">Low Stock ({lowStockItems.length})</option>
              <option value="out_of_stock">Out of Stock ({outOfStockItems.length})</option>
              <option value="near_expiry">Near Expiry ({nearExpiryItems.length})</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="stock">Sort by Stock</option>
              <option value="expiry">Sort by Expiry</option>
              <option value="value">Sort by Value</option>
            </select>
          </div>
        </div>

        {/* Stock Items List */}
        <div className="stock-items-list">
          {getDisplayItems().map((item) => {
            const stockStatus = getStockStatusBadge(item);
            const expiryStatus = getExpiryStatusBadge(item);
            const StatusIcon = stockStatus.icon;
            
            return (
              <div 
                key={item.id} 
                className={`stock-item-card ${stockStatus.class} ${item.isNearExpiry ? 'near-expiry' : ''}`}
              >
                <div className="stock-item-header">
                  <div className="stock-item-info">
                    <div className="stock-item-name">{item.name}</div>
                    <div className="stock-item-details">
                      <div>Brand: {item.brand} | Category: {item.category}</div>
                      <div>Salt: {item.salt} | Batch: {item.batchNumber}</div>
                      <div>Location: {item.location} | Supplier: {item.supplier}</div>
                    </div>
                  </div>
                  
                  <div className="stock-item-status">
                    <div className={`stock-status-badge ${stockStatus.class}`}>
                      <StatusIcon size={14} />
                      {stockStatus.label}
                    </div>
                    <div className={`stock-quantity ${item.isLowStock ? 'low' : ''} ${item.isOutOfStock ? 'out' : ''}`}>
                      {item.currentStock}
                    </div>
                  </div>
                </div>

                <div className="stock-metrics">
                  <div className="metric-item">
                    <span className="metric-label">Reorder Level</span>
                    <span className="metric-value">{item.reorderLevel}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Max Stock</span>
                    <span className="metric-value">{item.maxStock}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Cost Price</span>
                    <span className="metric-value">{formatCurrency(item.costPrice)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">MRP</span>
                    <span className="metric-value">{formatCurrency(item.mrp)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Stock Value</span>
                    <span className="metric-value">{formatCurrency(item.currentStock * item.costPrice)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Expiry Date</span>
                    <span className="metric-value" style={{ color: expiryStatus.color }}>
                      {format(new Date(item.expiryDate), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>

                {(item.isLowStock || item.isNearExpiry) && (
                  <div className="stock-alerts">
                    {item.isLowStock && (
                      <div className="alert-badge low-stock">
                        <AlertTriangle size={14} />
                        Stock below reorder level - Consider reordering
                      </div>
                    )}
                    {item.isNearExpiry && (
                      <div className="alert-badge near-expiry">
                        <Calendar size={14} />
                        Expires in {item.daysToExpiry} days
                      </div>
                    )}
                  </div>
                )}

                <div className="stock-actions">
                  <button className="btn btn-outline btn-small">
                    View Details
                  </button>
                  <button className="btn btn-primary btn-small">
                    Adjust Stock
                  </button>
                  {item.isLowStock && (
                    <button className="btn btn-secondary btn-small">
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More Button */}
        {viewMode === 'all' && allItems.length > 20 && (
          <div className="show-more">
            <button className="btn btn-outline">
              Show More Items ({allItems.length - 20} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-card">
          <h4>Quick Actions</h4>
          <div className="action-buttons">
            <button className="btn btn-primary">
              <Package size={16} />
              Bulk Stock Update
            </button>
            <button className="btn btn-secondary">
              <AlertTriangle size={16} />
              Generate Reorder List
            </button>
            <button className="btn btn-outline">
              <TrendingUp size={16} />
              Stock Valuation Report
            </button>
          </div>
        </div>
        
        <div className="recent-activity">
          <h4>Recent Stock Activity</h4>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">2 hours ago</span>
              <span className="activity-text">Stock adjusted for Paracetamol 500mg</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">4 hours ago</span>
              <span className="activity-text">New stock received from MedSupply Co.</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">6 hours ago</span>
              <span className="activity-text">Low stock alert for Amoxicillin 250mg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockOverview;
