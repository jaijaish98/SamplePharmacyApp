import { useState } from 'react';
import { Clock, Play, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useBilling } from '../../contexts/BillingContext';

const HeldBillsModal = ({ onClose }) => {
  const { heldBills, retrieveHeldBill } = useBilling();
  const [selectedBill, setSelectedBill] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleRetrieveBill = (heldBillId) => {
    if (retrieveHeldBill(heldBillId)) {
      alert('Bill retrieved successfully!');
      onClose();
    } else {
      alert('Failed to retrieve bill');
    }
  };

  const handleDeleteHeldBill = (heldBillId) => {
    if (window.confirm('Are you sure you want to delete this held bill?')) {
      // In a real app, this would delete the held bill
      alert('Held bill deleted');
    }
  };

  const handleViewBill = (heldBill) => {
    setSelectedBill(heldBill);
  };

  if (selectedBill) {
    return (
      <div className="modal-overlay">
        <div className="modal-content held-bill-detail-modal">
          <div className="modal-header">
            <h3>Held Bill Details - {selectedBill.name}</h3>
            <button className="btn-icon" onClick={() => setSelectedBill(null)}>×</button>
          </div>

          <div className="modal-body">
            <div className="held-bill-details">
              {/* Bill Info */}
              <div className="bill-info-section">
                <h4>Bill Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span>Hold Name:</span>
                    <span>{selectedBill.name}</span>
                  </div>
                  <div className="info-item">
                    <span>Held On:</span>
                    <span>{format(new Date(selectedBill.timestamp), 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                  <div className="info-item">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(selectedBill.bill.total)}</span>
                  </div>
                  <div className="info-item">
                    <span>Items Count:</span>
                    <span>{selectedBill.bill.items.length}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              {selectedBill.bill.customer && (
                <div className="customer-info-section">
                  <h4>Customer Information</h4>
                  <div className="customer-details">
                    <p><strong>Name:</strong> {selectedBill.bill.customer.name}</p>
                    <p><strong>Phone:</strong> {selectedBill.bill.customer.phone}</p>
                    {selectedBill.bill.customer.email && (
                      <p><strong>Email:</strong> {selectedBill.bill.customer.email}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="items-section">
                <h4>Items in Bill</h4>
                <div className="items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBill.bill.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="item-info">
                              <div className="item-name">{item.name}</div>
                              <div className="item-brand">{item.brand}</div>
                            </div>
                          </td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.unitPrice)}</td>
                          <td>{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bill-summary-section">
                <h4>Bill Summary</h4>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedBill.bill.subtotal)}</span>
                  </div>
                  {selectedBill.bill.discount > 0 && (
                    <div className="summary-row">
                      <span>Discount:</span>
                      <span>-{formatCurrency(selectedBill.bill.discount)}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>GST:</span>
                    <span>{formatCurrency(selectedBill.bill.gstAmount)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedBill.bill.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              className="btn btn-outline"
              onClick={() => setSelectedBill(null)}
            >
              Back to List
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => handleRetrieveBill(selectedBill.id)}
            >
              <Play size={16} />
              Retrieve Bill
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content held-bills-modal">
        <div className="modal-header">
          <h3>Held Bills ({heldBills.length})</h3>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {heldBills.length === 0 ? (
            <div className="empty-state">
              <Clock size={48} />
              <h3>No held bills</h3>
              <p>Bills that are put on hold will appear here</p>
            </div>
          ) : (
            <div className="held-bills-list">
              {heldBills.map((heldBill) => (
                <div key={heldBill.id} className="held-bill-item">
                  <div className="held-bill-header">
                    <div className="bill-name">
                      <Clock size={16} />
                      {heldBill.name}
                    </div>
                    <div className="bill-timestamp">
                      {format(new Date(heldBill.timestamp), 'dd/MM/yyyy HH:mm')}
                    </div>
                  </div>

                  <div className="held-bill-details">
                    <div className="bill-summary">
                      <div className="summary-item">
                        <span>Customer:</span>
                        <span>{heldBill.bill.customer?.name || 'Walk-in Customer'}</span>
                      </div>
                      <div className="summary-item">
                        <span>Items:</span>
                        <span>{heldBill.bill.items.length}</span>
                      </div>
                      <div className="summary-item">
                        <span>Total:</span>
                        <span>{formatCurrency(heldBill.bill.total)}</span>
                      </div>
                    </div>

                    <div className="items-preview">
                      <h5>Items:</h5>
                      <div className="items-list">
                        {heldBill.bill.items.slice(0, 3).map((item, index) => (
                          <span key={index} className="item-preview">
                            {item.name} ({item.quantity})
                            {index < Math.min(2, heldBill.bill.items.length - 1) && ', '}
                          </span>
                        ))}
                        {heldBill.bill.items.length > 3 && (
                          <span className="more-items">
                            +{heldBill.bill.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="held-bill-actions">
                    <button 
                      className="btn btn-outline btn-small"
                      onClick={() => handleViewBill(heldBill)}
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => handleRetrieveBill(heldBill.id)}
                    >
                      <Play size={14} />
                      Retrieve
                    </button>
                    <button 
                      className="btn btn-outline btn-small danger"
                      onClick={() => handleDeleteHeldBill(heldBill.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeldBillsModal;
