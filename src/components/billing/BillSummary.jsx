import React from 'react';
import {
  Calculator,
  Package,
  Percent,
  Receipt,
  TrendingUp
} from 'lucide-react';
import './BillSummary.css';

const BillSummary = ({ billSummary, itemCount }) => {
  const { subtotal, discount, gst, total } = billSummary;

  return (
    <div className="bill-summary">
      <div className="bill-summary-header">
        <h3>Bill Summary</h3>
        <div className="summary-icon">
          <Calculator size={20} />
        </div>
      </div>

      <div className="summary-content">
        {/* Item Count */}
        <div className="summary-row">
          <div className="summary-label">
            <Package size={16} />
            <span>Total Items</span>
          </div>
          <div className="summary-value">
            {itemCount} items
          </div>
        </div>

        {/* Subtotal */}
        <div className="summary-row">
          <div className="summary-label">
            <Receipt size={16} />
            <span>Subtotal</span>
          </div>
          <div className="summary-value">
            ₹{subtotal}
          </div>
        </div>

        {/* Discount */}
        <div className="summary-row discount-row">
          <div className="summary-label">
            <Percent size={16} />
            <span>Discount</span>
          </div>
          <div className="summary-value discount-value">
            -₹{discount}
          </div>
        </div>

        {/* GST */}
        <div className="summary-row">
          <div className="summary-label">
            <TrendingUp size={16} />
            <span>GST</span>
          </div>
          <div className="summary-value">
            +₹{gst}
          </div>
        </div>

        {/* Divider */}
        <div className="summary-divider"></div>

        {/* Total */}
        <div className="summary-row total-row">
          <div className="summary-label total-label">
            <span>Grand Total</span>
          </div>
          <div className="summary-value total-value">
            ₹{total}
          </div>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <div className="info-item">
            <span className="info-label">Tax Inclusive</span>
            <span className="info-value">Yes</span>
          </div>
          <div className="info-item">
            <span className="info-label">Rounding</span>
            <span className="info-value">₹0.00</span>
          </div>
        </div>

        {/* Savings Display */}
        {parseFloat(discount) > 0 && (
          <div className="savings-display">
            <div className="savings-badge">
              <Percent size={14} />
              <span>You saved ₹{discount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillSummary;
