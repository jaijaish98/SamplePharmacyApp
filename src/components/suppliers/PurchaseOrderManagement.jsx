import { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Send, Download, Package } from 'lucide-react';
import { format } from 'date-fns';
import { useSuppliers } from '../../contexts/SupplierContext';

const PurchaseOrderManagement = () => {
  const { purchaseOrders, suppliers, loading } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreatePO, setShowCreatePO] = useState(false);

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = !searchTerm || 
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || po.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return '#6b7280';
      case 'Sent': return '#f59e0b';
      case 'Delivered': return '#10b981';
      case 'Partially Received': return '#f59e0b';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="supplier-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading purchase orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-container">
      <div className="supplier-section">
        <div className="section-header">
          <div>
            <h3>Purchase Order Management</h3>
            <p>Create and manage purchase orders with suppliers</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreatePO(true)}
          >
            <Plus size={16} />
            Create Purchase Order
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
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
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Delivered">Delivered</option>
          <option value="Partially Received">Partially Received</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Purchase Orders List */}
      <div className="po-list">
        {filteredPOs.map((po) => (
          <div key={po.id} className={`po-card ${po.status.toLowerCase().replace(' ', '-')}`}>
            <div className="po-header">
              <div>
                <div className="po-id">{po.id}</div>
                <div className="po-supplier">{po.supplierName}</div>
                <div className="po-date">
                  Order Date: {format(new Date(po.orderDate), 'dd/MM/yyyy')}
                </div>
                <div className="po-date">
                  Expected Delivery: {format(new Date(po.expectedDeliveryDate), 'dd/MM/yyyy')}
                </div>
              </div>
              <div>
                <div className={`po-status ${po.status.toLowerCase().replace(' ', '-')}`}>
                  {po.status}
                </div>
                <div className="po-amount">
                  {formatCurrency(po.totalAmount)}
                </div>
              </div>
            </div>

            <div className="po-items">
              <h5>Items ({po.items.length})</h5>
              {po.items.slice(0, 3).map((item) => (
                <div key={item.id} className="po-item">
                  <span className="item-name">{item.productName}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                  <span className="item-amount">{formatCurrency(item.totalAmount)}</span>
                </div>
              ))}
              {po.items.length > 3 && (
                <div className="po-item">
                  <span>+{po.items.length - 3} more items</span>
                </div>
              )}
            </div>

            {po.notes && (
              <div className="po-notes">
                <strong>Notes:</strong> {po.notes}
              </div>
            )}

            <div className="po-actions">
              <button className="btn-icon" title="View Details">
                <Eye size={16} />
              </button>
              <button className="btn-icon" title="Edit">
                <Edit size={16} />
              </button>
              {po.status === 'Draft' && (
                <button className="btn btn-primary btn-small">
                  <Send size={14} />
                  Send
                </button>
              )}
              <button className="btn btn-outline btn-small">
                <Download size={14} />
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPOs.length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No purchase orders found</h3>
          <p>Create your first purchase order to get started</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreatePO(true)}
          >
            <Plus size={16} />
            Create Purchase Order
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="po-stats">
        <div className="stat-card">
          <div className="stat-value">{purchaseOrders.length}</div>
          <div className="stat-label">Total POs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{purchaseOrders.filter(po => po.status === 'Sent').length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{purchaseOrders.filter(po => po.status === 'Delivered').length}</div>
          <div className="stat-label">Delivered</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {formatCurrency(purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0))}
          </div>
          <div className="stat-label">Total Value</div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderManagement;
