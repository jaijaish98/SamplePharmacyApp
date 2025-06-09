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
    </div>
  );
};

export default BillSummary;
