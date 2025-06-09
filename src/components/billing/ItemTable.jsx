import React, { useState } from 'react';
import {
  Edit3,
  Trash2,
  Plus,
  Minus,
  Check,
  X,
  Package,
  Percent
} from 'lucide-react';
import './ItemTable.css';

const ItemTable = ({ items, onUpdateItem, onRemoveItem }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({});

  const startEditing = (item) => {
    setEditingItem(item.id);
    setEditValues({
      quantity: item.quantity,
      sellingPrice: item.sellingPrice,
      discount: item.discount || 0
    });
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditValues({});
  };

  const saveEditing = () => {
    if (editingItem) {
      onUpdateItem(editingItem, 'quantity', editValues.quantity);
      onUpdateItem(editingItem, 'sellingPrice', editValues.sellingPrice);
      onUpdateItem(editingItem, 'discount', editValues.discount);
      setEditingItem(null);
      setEditValues({});
    }
  };

  const updateQuantity = (itemId, change) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + change));
      onUpdateItem(itemId, 'quantity', newQuantity);
    }
  };

  const calculateItemTotal = (item) => {
    const subtotal = item.quantity * item.sellingPrice;
    const discount = item.discount || 0;
    return subtotal - discount;
  };

  const calculateGST = (item) => {
    const itemTotal = calculateItemTotal(item);
    return itemTotal * (item.gstRate / 100);
  };

  if (items.length === 0) {
    return (
      <div className="item-table-empty">
        <Package size={48} />
        <h3>No items added</h3>
        <p>Search and add medicines to start billing</p>
      </div>
    );
  }

  return (
    <div className="item-table">
      <div className="item-table-header">
        <h3>Bill Items ({items.length})</h3>
        <div className="table-summary">
          <span>Total Items: {items.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Medicine Details</th>
              <th>Batch/Expiry</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Discount</th>
              <th>GST</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="item-row">
                <td className="serial-no">{index + 1}</td>
                
                <td className="medicine-details">
                  <div className="medicine-info">
                    <h4>{item.name}</h4>
                    <p className="brand">{item.brand}</p>
                    <p className="composition">{item.composition}</p>
                  </div>
                </td>
                
                <td className="batch-expiry">
                  <div className="batch-info">
                    <p className="batch">Batch: {item.batchNo}</p>
                    <p className="expiry">
                      Exp: {new Date(item.expiry).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                
                <td className="quantity-cell">
                  {editingItem === item.id ? (
                    <input
                      type="number"
                      value={editValues.quantity}
                      onChange={(e) => setEditValues({
                        ...editValues,
                        quantity: Math.max(1, parseInt(e.target.value) || 1)
                      })}
                      className="edit-input quantity-input"
                      min="1"
                      max={item.stock}
                    />
                  ) : (
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                  <div className="stock-info">
                    <small>{item.stock} available</small>
                  </div>
                </td>
                
                <td className="price-cell">
                  {editingItem === item.id ? (
                    <input
                      type="number"
                      value={editValues.sellingPrice}
                      onChange={(e) => setEditValues({
                        ...editValues,
                        sellingPrice: parseFloat(e.target.value) || 0
                      })}
                      className="edit-input price-input"
                      step="0.01"
                    />
                  ) : (
                    <div className="price-info">
                      <span className="selling-price">₹{item.sellingPrice}</span>
                      <small className="mrp">MRP: ₹{item.mrp}</small>
                    </div>
                  )}
                </td>
                
                <td className="discount-cell">
                  {editingItem === item.id ? (
                    <input
                      type="number"
                      value={editValues.discount}
                      onChange={(e) => setEditValues({
                        ...editValues,
                        discount: parseFloat(e.target.value) || 0
                      })}
                      className="edit-input discount-input"
                      step="0.01"
                    />
                  ) : (
                    <div className="discount-info">
                      <span className="discount-amount">
                        {item.discount ? `₹${item.discount.toFixed(2)}` : '-'}
                      </span>
                    </div>
                  )}
                </td>
                
                <td className="gst-cell">
                  <div className="gst-info">
                    <span className="gst-rate">{item.gstRate}%</span>
                    <span className="gst-amount">₹{calculateGST(item).toFixed(2)}</span>
                  </div>
                </td>
                
                <td className="total-cell">
                  <div className="item-total">
                    <span className="total-amount">
                      ₹{(calculateItemTotal(item) + calculateGST(item)).toFixed(2)}
                    </span>
                  </div>
                </td>
                
                <td className="actions-cell">
                  {editingItem === item.id ? (
                    <div className="edit-actions">
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={saveEditing}
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={cancelEditing}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="item-actions">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => startEditing(item)}
                        title="Edit item"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => onRemoveItem(item.id)}
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="table-totals">
          <div className="total-row">
            <span>Total Quantity:</span>
            <span>{items.reduce((sum, item) => sum + item.quantity, 0)} units</span>
          </div>
          <div className="total-row">
            <span>Total Items:</span>
            <span>{items.length}</span>
          </div>
          <div className="total-row">
            <span>Subtotal:</span>
            <span>₹{items.reduce((sum, item) => sum + calculateItemTotal(item), 0).toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Total GST:</span>
            <span>₹{items.reduce((sum, item) => sum + calculateGST(item), 0).toFixed(2)}</span>
          </div>
          <div className="total-row grand-total">
            <span>Grand Total:</span>
            <span>₹{items.reduce((sum, item) => sum + calculateItemTotal(item) + calculateGST(item), 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemTable;
