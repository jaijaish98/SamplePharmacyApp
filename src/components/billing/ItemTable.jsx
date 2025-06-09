import { useState } from 'react';
import { Edit, Trash2, Package } from 'lucide-react';
import { useBilling } from '../../contexts/BillingContext';

const ItemTable = () => {
  const { currentBill, updateBillItem, removeItemFromBill } = useBilling();
  const [editingItem, setEditingItem] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const item = currentBill.items.find(item => item.id === itemId);
    if (item && newQuantity <= item.availableStock && newQuantity > 0) {
      const newTotal = newQuantity * item.unitPrice - item.discount;
      updateBillItem(itemId, { 
        quantity: newQuantity, 
        total: newTotal 
      });
    }
  };

  const handlePriceChange = (itemId, newPrice) => {
    const item = currentBill.items.find(item => item.id === itemId);
    if (item && newPrice >= 0) {
      const newTotal = item.quantity * newPrice - item.discount;
      updateBillItem(itemId, { 
        unitPrice: newPrice, 
        total: newTotal 
      });
    }
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeItemFromBill(itemId);
    }
  };

  if (currentBill.items.length === 0) {
    return (
      <div className="item-table">
        <div className="empty-bill">
          <Package size={48} />
          <h3>No items added</h3>
          <p>Search and add medicines to start billing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="item-table">
      <div className="table-container">
        <table className="bill-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item Name</th>
              <th>Batch/Expiry</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBill.items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="item-cell">
                    <div className="item-name">{item.name}</div>
                    <div className="item-brand">{item.brand}</div>
                  </div>
                </td>
                <td>
                  <div className="batch-cell">
                    <div className="batch-number">{item.batchNumber}</div>
                    <div className="expiry-date">
                      Exp: {new Date(item.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    className="quantity-input"
                    min="1"
                    max={item.availableStock}
                  />
                  <div className="stock-info">
                    Available: {item.availableStock}
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handlePriceChange(item.id, parseFloat(e.target.value) || 0)}
                    className="price-input"
                    step="0.01"
                    min="0"
                  />
                  <div className="mrp-info">
                    MRP: {formatCurrency(item.mrp)}
                  </div>
                </td>
                <td>
                  <div className="total-cell">
                    <div className="total-amount">{formatCurrency(item.total)}</div>
                    {item.discount > 0 && (
                      <div className="discount-info">
                        Discount: {formatCurrency(item.discount)}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="item-actions">
                    <button
                      className="action-btn"
                      onClick={() => setEditingItem(item.id)}
                      title="Edit Item"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="action-btn danger"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Summary */}
      <div className="table-summary">
        <div className="summary-item">
          <span>Total Items:</span>
          <span>{currentBill.items.length}</span>
        </div>
        <div className="summary-item">
          <span>Total Quantity:</span>
          <span>{currentBill.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div className="summary-item">
          <span>Subtotal:</span>
          <span>{formatCurrency(currentBill.subtotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default ItemTable;
