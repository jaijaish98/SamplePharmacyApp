import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useBilling } from '../../contexts/BillingContext';

const PaymentPanel = ({ onClose, onPaymentComplete }) => {
  const { currentBill, processPayment } = useBilling();
  const [amountReceived, setAmountReceived] = useState(currentBill.total.toString());
  const [processing, setProcessing] = useState(false);
  const paymentMethod = 'Cash'; // Default to Cash payment only

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateChange = () => {
    const received = parseFloat(amountReceived) || 0;
    return Math.max(0, received - currentBill.total);
  };

  const handlePayment = async () => {
    if (parseFloat(amountReceived) < currentBill.total) {
      alert('Amount received cannot be less than total amount');
      return;
    }

    setProcessing(true);

    try {
      const paymentDetails = {
        method: 'Cash',
        amountPaid: parseFloat(amountReceived),
        changeReturned: calculateChange()
      };

      const invoice = await processPayment(paymentDetails);
      onPaymentComplete(invoice);
    } catch (error) {
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Removed payment method options - only Cash payment supported

  return (
    <div className="modal-overlay">
      <div className="modal-content payment-modal">
        <div className="modal-header">
          <h3>Process Payment</h3>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Bill Summary */}
          <div className="payment-summary">
            <h4>Bill Summary</h4>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(currentBill.subtotal)}</span>
              </div>
              {currentBill.discount > 0 && (
                <div className="summary-row">
                  <span>Discount:</span>
                  <span>-{formatCurrency(currentBill.discount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>GST:</span>
                <span>{formatCurrency(currentBill.gstAmount)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>{formatCurrency(currentBill.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method - Cash Only */}
          <div className="payment-method-info">
            <h4>Payment Method: Cash</h4>
            <p>Only cash payments are accepted at this time.</p>
          </div>

          {/* Cash Payment Section */}
          <div className="cash-payment-section">
            <h4>Cash Payment</h4>
            <div className="amount-input-section">
              <div className="form-group">
                <label>Amount Received</label>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  className="amount-input"
                  step="1"
                  min={currentBill.total}
                />
              </div>

              <div className="change-calculation">
                <div className="change-row">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(currentBill.total)}</span>
                </div>
                <div className="change-row">
                  <span>Amount Received:</span>
                  <span>{formatCurrency(parseFloat(amountReceived) || 0)}</span>
                </div>
                <div className="change-row change">
                  <span>Change to Return:</span>
                  <span>{formatCurrency(calculateChange())}</span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="quick-amounts">
                <h5>Quick Amounts</h5>
                <div className="quick-amount-buttons">
                  {[
                    currentBill.total,
                    Math.ceil(currentBill.total / 50) * 50,
                    Math.ceil(currentBill.total / 100) * 100,
                    Math.ceil(currentBill.total / 500) * 500
                  ].map((amount, index) => (
                    <button
                      key={index}
                      className="quick-amount-btn"
                      onClick={() => setAmountReceived(amount.toString())}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>



          {/* Customer Information */}
          {currentBill.customer && (
            <div className="customer-payment-info">
              <h4>Customer Information</h4>
              <div className="customer-details">
                <p><strong>Name:</strong> {currentBill.customer.name}</p>
                <p><strong>Phone:</strong> {currentBill.customer.phone}</p>
                {currentBill.customer.email && (
                  <p><strong>Email:</strong> {currentBill.customer.email}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`btn btn-primary ${processing ? 'loading' : ''}`}
            onClick={handlePayment}
            disabled={processing || parseFloat(amountReceived) < currentBill.total}
          >
            <Calculator size={16} />
            {processing ? 'Processing...' : 'Process Cash Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPanel;
