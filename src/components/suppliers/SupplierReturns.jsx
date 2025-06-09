import { useState } from 'react';
import { RotateCcw, Plus, Search, Package, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useSuppliers } from '../../contexts/SupplierContext';

const SupplierReturns = () => {
  const { suppliers, loading } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock returns data
  const mockReturns = [
    {
      id: 'RET001',
      supplierId: 1,
      supplierName: 'MedPlus Distributors',
      returnDate: new Date(),
      items: [
        { name: 'Paracetamol 500mg', batchNo: 'PAR001', quantity: 50, reason: 'Expired', amount: 2275 },
        { name: 'Cough Syrup 100ml', batchNo: 'CS001', quantity: 10, reason: 'Damaged', amount: 950 }
      ],
      totalAmount: 3225,
      status: 'Pending',
      notes: 'Items received in damaged condition'
    },
    {
      id: 'RET002',
      supplierId: 2,
      supplierName: 'PharmaCorp Ltd',
      returnDate: new Date(Date.now() - 86400000),
      items: [
        { name: 'Insulin Pen', batchNo: 'INS001', quantity: 5, reason: 'Extra', amount: 2250 }
      ],
      totalAmount: 2250,
      status: 'Approved',
      notes: 'Excess stock return'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getReasonColor = (reason) => {
    switch (reason) {
      case 'Expired': return '#ef4444';
      case 'Damaged': return '#f59e0b';
      case 'Extra': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="supplier-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading returns data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-container">
      <div className="supplier-section">
        <div className="section-header">
          <div>
            <h3>Returns to Supplier</h3>
            <p>Manage returns of expired, damaged, or excess inventory</p>
          </div>
          <button className="btn btn-primary">
            <Plus size={16} />
            Create Return Note
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by return ID or supplier name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Returns List */}
      <div className="returns-list">
        {mockReturns.map((returnItem) => (
          <div key={returnItem.id} className="return-card">
            <div className="return-header">
              <div>
                <div className="return-id">{returnItem.id}</div>
                <div className="return-supplier">{returnItem.supplierName}</div>
                <div className="return-date">
                  Return Date: {format(new Date(returnItem.returnDate), 'dd/MM/yyyy')}
                </div>
              </div>
              <div>
                <div className="return-amount">
                  {formatCurrency(returnItem.totalAmount)}
                </div>
                <div className={`return-status ${returnItem.status.toLowerCase()}`}>
                  {returnItem.status}
                </div>
              </div>
            </div>

            <div className="return-items">
              <h5>Return Items ({returnItem.items.length})</h5>
              <div className="return-item-header">
                <span>Product</span>
                <span>Batch No.</span>
                <span>Quantity</span>
                <span>Reason</span>
                <span>Amount</span>
              </div>
              {returnItem.items.map((item, index) => (
                <div key={index} className="return-item">
                  <span>{item.name}</span>
                  <span>{item.batchNo}</span>
                  <span>{item.quantity}</span>
                  <span 
                    className="return-reason"
                    style={{ color: getReasonColor(item.reason) }}
                  >
                    {item.reason}
                  </span>
                  <span>{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>

            {returnItem.notes && (
              <div className="return-notes">
                <strong>Notes:</strong> {returnItem.notes}
              </div>
            )}

            <div className="return-actions">
              <button className="btn btn-outline btn-small">
                Edit
              </button>
              {returnItem.status === 'Pending' && (
                <button className="btn btn-primary btn-small">
                  Submit Return
                </button>
              )}
              <button className="btn btn-outline btn-small">
                Print
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Return Reasons */}
      <div className="return-reasons">
        <h4>Common Return Reasons</h4>
        <div className="reason-cards">
          <div className="reason-card">
            <div className="reason-icon expired">
              <AlertTriangle size={24} />
            </div>
            <div className="reason-content">
              <h5>Expired Products</h5>
              <p>Items that have passed their expiry date</p>
            </div>
          </div>
          
          <div className="reason-card">
            <div className="reason-icon damaged">
              <Package size={24} />
            </div>
            <div className="reason-content">
              <h5>Damaged Goods</h5>
              <p>Products received in damaged condition</p>
            </div>
          </div>
          
          <div className="reason-card">
            <div className="reason-icon extra">
              <RotateCcw size={24} />
            </div>
            <div className="reason-content">
              <h5>Excess Stock</h5>
              <p>Surplus inventory to be returned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Return Summary */}
      <div className="return-summary">
        <div className="summary-card">
          <h4>Return Summary</h4>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">Total Returns</span>
              <span className="summary-value">{mockReturns.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Pending</span>
              <span className="summary-value">
                {mockReturns.filter(r => r.status === 'Pending').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Value</span>
              <span className="summary-value">
                {formatCurrency(mockReturns.reduce((sum, r) => sum + r.totalAmount, 0))}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">This Month</span>
              <span className="summary-value">
                {formatCurrency(mockReturns.filter(r => 
                  new Date(r.returnDate).getMonth() === new Date().getMonth()
                ).reduce((sum, r) => sum + r.totalAmount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierReturns;
