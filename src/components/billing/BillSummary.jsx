import { useState } from 'react';
import { Percent, Calculator } from 'lucide-react';
import { useBilling } from '../../contexts/BillingContext';

const BillSummary = () => {
  const { currentBill, applyDiscount, settings } = useBilling();
  const [discountType, setDiscountType] = useState('amount'); // 'amount' or 'percentage'
  const [discountValue, setDiscountValue] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDiscountApply = () => {
    if (!discountValue) return;

    let discountAmount = 0;
    const value = parseFloat(discountValue);

    if (discountType === 'percentage') {
      if (value > settings.maxDiscountPercent) {
        alert(`Maximum discount allowed is ${settings.maxDiscountPercent}%`);
        return;
      }
      discountAmount = (currentBill.subtotal * value) / 100;
    } else {
      discountAmount = value;
    }

    if (discountAmount > currentBill.subtotal) {
      alert('Discount cannot be more than subtotal');
      return;
    }

    applyDiscount(discountAmount);
    setDiscountValue('');
  };

  const calculateGSTBreakdown = () => {
    const discountedAmount = currentBill.subtotal - currentBill.discount;
    const cgst = Math.round(discountedAmount * settings.cgstRate);
    const sgst = Math.round(discountedAmount * settings.sgstRate);
    return { cgst, sgst, total: cgst + sgst };
  };

  const gstBreakdown = calculateGSTBreakdown();

  return (
    <div className="bill-summary">
      {/* Discount Section */}
      {settings.allowDiscount && (
        <div className="discount-section">
          <h4>Apply Discount</h4>
          <div className="discount-controls">
            <div className="discount-type">
              <label>
                <input
                  type="radio"
                  value="amount"
                  checked={discountType === 'amount'}
                  onChange={(e) => setDiscountType(e.target.value)}
                />
                Amount (₹)
              </label>
              <label>
                <input
                  type="radio"
                  value="percentage"
                  checked={discountType === 'percentage'}
                  onChange={(e) => setDiscountType(e.target.value)}
                />
                Percentage (%)
              </label>
            </div>
            
            <div className="discount-input">
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === 'percentage' ? 'Enter %' : 'Enter ₹'}
                className="discount-value-input"
                min="0"
                max={discountType === 'percentage' ? settings.maxDiscountPercent : currentBill.subtotal}
                step={discountType === 'percentage' ? '0.1' : '1'}
              />
              <button 
                className="btn btn-outline btn-small"
                onClick={handleDiscountApply}
                disabled={!discountValue}
              >
                <Percent size={14} />
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bill Summary */}
      <div className="summary-section">
        <div className="summary-row">
          <span className="summary-label">Subtotal:</span>
          <span className="summary-value">{formatCurrency(currentBill.subtotal)}</span>
        </div>

        {currentBill.discount > 0 && (
          <div className="summary-row discount">
            <span className="summary-label">Discount:</span>
            <span className="summary-value">-{formatCurrency(currentBill.discount)}</span>
          </div>
        )}

        <div className="summary-row">
          <span className="summary-label">Taxable Amount:</span>
          <span className="summary-value">
            {formatCurrency(currentBill.subtotal - currentBill.discount)}
          </span>
        </div>

        {/* GST Breakdown */}
        {settings.autoCalculateGST && (
          <>
            <div className="summary-row gst">
              <span className="summary-label">CGST ({(settings.cgstRate * 100).toFixed(1)}%):</span>
              <span className="summary-value">{formatCurrency(gstBreakdown.cgst)}</span>
            </div>
            
            <div className="summary-row gst">
              <span className="summary-label">SGST ({(settings.sgstRate * 100).toFixed(1)}%):</span>
              <span className="summary-value">{formatCurrency(gstBreakdown.sgst)}</span>
            </div>
            
            <div className="summary-row gst-total">
              <span className="summary-label">Total GST:</span>
              <span className="summary-value">{formatCurrency(currentBill.gstAmount)}</span>
            </div>
          </>
        )}

        <div className="summary-row total">
          <span className="summary-label">Total Amount:</span>
          <span className="summary-value">{formatCurrency(currentBill.total)}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="payment-method-section">
        <h4>Payment Method</h4>
        <div className="payment-methods">
          <label className="payment-option">
            <input
              type="radio"
              value="Cash"
              checked={currentBill.paymentMethod === 'Cash'}
              onChange={(e) => {/* Update payment method */}}
            />
            Cash
          </label>
          <label className="payment-option">
            <input
              type="radio"
              value="Card"
              checked={currentBill.paymentMethod === 'Card'}
              onChange={(e) => {/* Update payment method */}}
            />
            Card
          </label>
          <label className="payment-option">
            <input
              type="radio"
              value="UPI"
              checked={currentBill.paymentMethod === 'UPI'}
              onChange={(e) => {/* Update payment method */}}
            />
            UPI
          </label>
          <label className="payment-option">
            <input
              type="radio"
              value="Wallet"
              checked={currentBill.paymentMethod === 'Wallet'}
              onChange={(e) => {/* Update payment method */}}
            />
            Wallet
          </label>
        </div>
      </div>

      {/* Bill Notes */}
      <div className="notes-section">
        <h4>Notes</h4>
        <textarea
          value={currentBill.notes}
          onChange={(e) => {/* Update notes */}}
          placeholder="Add any special instructions or notes..."
          className="notes-input"
          rows="3"
        />
      </div>

      {/* Quick Calculations */}
      <div className="quick-calculations">
        <div className="calc-item">
          <Calculator size={16} />
          <span>Items: {currentBill.items.length}</span>
        </div>
        <div className="calc-item">
          <span>Qty: {currentBill.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div className="calc-item">
          <span>Avg: {formatCurrency(currentBill.items.length > 0 ? currentBill.total / currentBill.items.length : 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default BillSummary;
