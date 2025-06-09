import { useState } from 'react';
import { Package, CheckCircle, AlertTriangle, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useSuppliers } from '../../contexts/SupplierContext';

const GRNManagement = () => {
  const { purchaseOrders, loading } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState('');

  // Get delivered POs that need GRN
  const deliveredPOs = purchaseOrders.filter(po => po.status === 'Delivered');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="supplier-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading GRN data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-container">
      <div className="supplier-section">
        <div className="section-header">
          <div>
            <h3>Goods Receipt Note (GRN) Management</h3>
            <p>Confirm receipt of goods and update inventory</p>
          </div>
          <button className="btn btn-primary">
            <Plus size={16} />
            Create GRN
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by PO ID or supplier name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* GRN List */}
      <div className="grn-list">
        {deliveredPOs.map((po) => (
          <div key={po.id} className="grn-card">
            <div className="grn-header">
              <div>
                <div className="grn-id">GRN-{po.id}</div>
                <div className="grn-supplier">{po.supplierName}</div>
                <div className="grn-date">
                  Delivered: {format(new Date(po.actualDeliveryDate), 'dd/MM/yyyy')}
                </div>
              </div>
              <div className="grn-status">Pending GRN</div>
            </div>

            <div className="grn-items">
              <h5>Items to Receive</h5>
              <div className="grn-item-header">
                <span>Product</span>
                <span>Ordered</span>
                <span>Received</span>
                <span>Batch</span>
                <span>Expiry</span>
              </div>
              {po.items.map((item) => (
                <div key={item.id} className="grn-item">
                  <span>{item.productName}</span>
                  <span>{item.quantity}</span>
                  <input 
                    type="number" 
                    defaultValue={item.quantity}
                    className="grn-input"
                    max={item.quantity}
                  />
                  <input 
                    type="text" 
                    placeholder="Batch No."
                    className="grn-input"
                  />
                  <input 
                    type="date" 
                    className="grn-input"
                  />
                </div>
              ))}
            </div>

            <div className="grn-summary">
              <div className="summary-item">
                <span>Total Amount: {formatCurrency(po.totalAmount)}</span>
              </div>
              <div className="summary-item">
                <span>Items: {po.items.length}</span>
              </div>
            </div>

            <div className="grn-actions">
              <button className="btn btn-outline">
                Save Draft
              </button>
              <button className="btn btn-primary">
                <CheckCircle size={16} />
                Confirm Receipt
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {deliveredPOs.length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No pending GRNs</h3>
          <p>All delivered orders have been processed</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grn-stats">
        <div className="stat-card">
          <div className="stat-value">{deliveredPOs.length}</div>
          <div className="stat-label">Pending GRNs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {deliveredPOs.reduce((sum, po) => sum + po.items.length, 0)}
          </div>
          <div className="stat-label">Items to Receive</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {formatCurrency(deliveredPOs.reduce((sum, po) => sum + po.totalAmount, 0))}
          </div>
          <div className="stat-label">Total Value</div>
        </div>
      </div>
    </div>
  );
};

export default GRNManagement;
