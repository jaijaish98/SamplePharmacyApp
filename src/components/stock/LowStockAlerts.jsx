import { useState } from 'react';
import { AlertTriangle, Package, ShoppingCart, Settings, Bell, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useStock } from '../../contexts/StockContext';

const LowStockAlerts = () => {
  const { 
    getLowStockItems, 
    getOutOfStockItems, 
    updateReorderLevel, 
    loading 
  } = useStock();

  const [alertType, setAlertType] = useState('all');
  const [showReorderSettings, setShowReorderSettings] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newReorderLevel, setNewReorderLevel] = useState('');

  const lowStockItems = getLowStockItems();
  const outOfStockItems = getOutOfStockItems();
  const allAlerts = [...lowStockItems, ...outOfStockItems];

  const getFilteredAlerts = () => {
    switch (alertType) {
      case 'low_stock':
        return lowStockItems;
      case 'out_of_stock':
        return outOfStockItems;
      default:
        return allAlerts;
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

  const getAlertPriority = (item) => {
    if (item.isOutOfStock) {
      return { level: 'critical', label: 'Critical', color: '#ef4444' };
    } else if (item.currentStock <= item.reorderLevel * 0.5) {
      return { level: 'high', label: 'High', color: '#f59e0b' };
    } else {
      return { level: 'medium', label: 'Medium', color: '#10b981' };
    }
  };

  const calculateReorderQuantity = (item) => {
    return Math.max(item.maxStock - item.currentStock, item.reorderLevel * 2);
  };

  const handleReorderLevelUpdate = (item) => {
    setSelectedItem(item);
    setNewReorderLevel(item.reorderLevel.toString());
    setShowReorderSettings(true);
  };

  const saveReorderLevel = () => {
    if (selectedItem && newReorderLevel) {
      updateReorderLevel(selectedItem.id, parseInt(newReorderLevel));
      setShowReorderSettings(false);
      setSelectedItem(null);
      setNewReorderLevel('');
    }
  };

  const generateReorderList = () => {
    const reorderList = getFilteredAlerts().map(item => ({
      name: item.name,
      currentStock: item.currentStock,
      reorderLevel: item.reorderLevel,
      suggestedQuantity: calculateReorderQuantity(item),
      supplier: item.supplier,
      estimatedCost: calculateReorderQuantity(item) * item.costPrice
    }));

    // In a real app, this would generate and download a PDF/Excel file
    console.log('Reorder List:', reorderList);
    alert('Reorder list generated! Check console for details.');
  };

  if (loading) {
    return (
      <div className="stock-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading stock alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-container">
      {/* Alert Summary */}
      <div className="stock-section">
        <div className="section-header">
          <h3>Stock Alert Summary</h3>
          <div className="alert-actions">
            <button 
              className="btn btn-primary"
              onClick={generateReorderList}
            >
              <Download size={16} />
              Generate Reorder List
            </button>
            <button className="btn btn-outline">
              <Bell size={16} />
              Alert Settings
            </button>
          </div>
        </div>

        <div className="alert-summary">
          <div className="summary-card critical">
            <div className="summary-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-value">{outOfStockItems.length}</div>
              <div className="summary-label">Out of Stock</div>
              <div className="summary-detail">Immediate action required</div>
            </div>
          </div>
          
          <div className="summary-card warning">
            <div className="summary-icon">
              <Package size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-value">{lowStockItems.length}</div>
              <div className="summary-label">Low Stock</div>
              <div className="summary-detail">Below reorder level</div>
            </div>
          </div>
          
          <div className="summary-card info">
            <div className="summary-icon">
              <ShoppingCart size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-value">
                {formatCurrency(allAlerts.reduce((sum, item) => sum + (calculateReorderQuantity(item) * item.costPrice), 0))}
              </div>
              <div className="summary-label">Estimated Reorder Cost</div>
              <div className="summary-detail">For all alerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Filter */}
      <div className="alert-filters">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${alertType === 'all' ? 'active' : ''}`}
            onClick={() => setAlertType('all')}
          >
            All Alerts ({allAlerts.length})
          </button>
          <button 
            className={`filter-tab ${alertType === 'out_of_stock' ? 'active' : ''}`}
            onClick={() => setAlertType('out_of_stock')}
          >
            Out of Stock ({outOfStockItems.length})
          </button>
          <button 
            className={`filter-tab ${alertType === 'low_stock' ? 'active' : ''}`}
            onClick={() => setAlertType('low_stock')}
          >
            Low Stock ({lowStockItems.length})
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="alert-list">
        {getFilteredAlerts().map((item) => {
          const priority = getAlertPriority(item);
          const reorderQuantity = calculateReorderQuantity(item);
          
          return (
            <div key={item.id} className={`alert-item ${priority.level}`}>
              <div className={`alert-icon ${priority.level}`}>
                <AlertTriangle size={20} />
              </div>
              
              <div className="alert-content">
                <div className="alert-header">
                  <div className="alert-title">{item.name}</div>
                  <div className={`alert-priority ${priority.level}`}>
                    {priority.label} Priority
                  </div>
                </div>
                
                <div className="alert-details">
                  <div className="alert-info">
                    <span>Current Stock: <strong>{item.currentStock}</strong></span>
                    <span>Reorder Level: <strong>{item.reorderLevel}</strong></span>
                    <span>Brand: {item.brand}</span>
                    <span>Category: {item.category}</span>
                  </div>
                  
                  <div className="alert-metrics">
                    <div className="metric">
                      <span className="metric-label">Suggested Reorder</span>
                      <span className="metric-value">{reorderQuantity} units</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Estimated Cost</span>
                      <span className="metric-value">{formatCurrency(reorderQuantity * item.costPrice)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Supplier</span>
                      <span className="metric-value">{item.supplier}</span>
                    </div>
                  </div>
                </div>
                
                <div className="alert-description">
                  {item.isOutOfStock ? (
                    <span className="alert-message critical">
                      <AlertTriangle size={14} />
                      Item is completely out of stock. Immediate reordering required.
                    </span>
                  ) : (
                    <span className="alert-message warning">
                      <Package size={14} />
                      Stock level is below reorder point. Consider reordering soon.
                    </span>
                  )}
                </div>
              </div>
              
              <div className="alert-actions">
                <button 
                  className="btn btn-outline btn-small"
                  onClick={() => handleReorderLevelUpdate(item)}
                >
                  <Settings size={14} />
                  Adjust Reorder Level
                </button>
                <button className="btn btn-secondary btn-small">
                  <ShoppingCart size={14} />
                  Create Purchase Order
                </button>
                {item.isOutOfStock && (
                  <button className="btn btn-primary btn-small">
                    <AlertTriangle size={14} />
                    Urgent Reorder
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {getFilteredAlerts().length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No stock alerts</h3>
          <p>All items are above their reorder levels</p>
        </div>
      )}

      {/* Reorder Level Settings Modal */}
      {showReorderSettings && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Update Reorder Level - {selectedItem.name}</h4>
              <button 
                className="btn-icon"
                onClick={() => setShowReorderSettings(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="reorder-settings">
                <div className="current-info">
                  <div className="info-item">
                    <span>Current Stock:</span>
                    <span>{selectedItem.currentStock}</span>
                  </div>
                  <div className="info-item">
                    <span>Current Reorder Level:</span>
                    <span>{selectedItem.reorderLevel}</span>
                  </div>
                  <div className="info-item">
                    <span>Max Stock:</span>
                    <span>{selectedItem.maxStock}</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>New Reorder Level</label>
                  <input
                    type="number"
                    value={newReorderLevel}
                    onChange={(e) => setNewReorderLevel(e.target.value)}
                    className="form-input"
                    min="1"
                    max={selectedItem.maxStock}
                  />
                  <small>Recommended: 10-20% of max stock capacity</small>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowReorderSettings(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={saveReorderLevel}
              >
                Update Reorder Level
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Statistics */}
      <div className="alert-statistics">
        <div className="stats-card">
          <h4>Alert Statistics</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Alerts</span>
              <span className="stat-value">{allAlerts.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Critical Alerts</span>
              <span className="stat-value">{outOfStockItems.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Reorder Level</span>
              <span className="stat-value">
                {Math.round(allAlerts.reduce((sum, item) => sum + item.reorderLevel, 0) / allAlerts.length) || 0}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Items Need Attention</span>
              <span className="stat-value">{allAlerts.filter(item => item.currentStock === 0 || item.currentStock <= item.reorderLevel * 0.5).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlerts;
