import { useState } from 'react';
import { CreditCard, DollarSign, Smartphone, Wallet, Calculator } from 'lucide-react';
import { useBilling } from '../../contexts/BillingContext';

const PaymentPanel = ({ onClose, onPaymentComplete }) => {
  const { currentBill, processPayment } = useBilling();
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amountReceived, setAmountReceived] = useState(currentBill.total.toString());
  const [processing, setProcessing] = useState(false);

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
    if (paymentMethod === 'Cash' && parseFloat(amountReceived) < currentBill.total) {
      alert('Amount received cannot be less than total amount');
      return;
    }

    setProcessing(true);

    try {
      const paymentDetails = {
        method: paymentMethod,
        amountPaid: parseFloat(amountReceived),
        changeReturned: paymentMethod === 'Cash' ? calculateChange() : 0
      };

      const invoice = await processPayment(paymentDetails);
      onPaymentComplete(invoice);
    } catch (error) {
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'Cash', label: 'Cash', icon: DollarSign, color: '#10b981' },
    { id: 'Card', label: 'Card', icon: CreditCard, color: '#3b82f6' },
    { id: 'UPI', label: 'UPI', icon: Smartphone, color: '#8b5cf6' },
    { id: 'Wallet', label: 'Wallet', icon: Wallet, color: '#f59e0b' }
  ];

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

          {/* Payment Method Selection */}
          <div className="payment-method-selection">
            <h4>Select Payment Method</h4>
            <div className="payment-methods-grid">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <button
                    key={method.id}
                    className={`payment-method-btn ${paymentMethod === method.id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(method.id)}
                    style={{ '--method-color': method.color }}
                  >
                    <IconComponent size={24} />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input for Cash */}
          {paymentMethod === 'Cash' && (
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
          )}

          {/* Card Payment */}
          {paymentMethod === 'Card' && (
            <div className="card-payment-section">
              <h4>Card Payment</h4>
              <div className="card-info">
                <p>Amount to be charged: <strong>{formatCurrency(currentBill.total)}</strong></p>
                <p>Please swipe/insert the card and follow the instructions on the card reader.</p>
              </div>
            </div>
          )}

          {/* UPI Payment */}
          {paymentMethod === 'UPI' && (
            <div className="upi-payment-section">
              <h4>UPI Payment</h4>
              <div className="upi-info">
                <p>Amount to be paid: <strong>{formatCurrency(currentBill.total)}</strong></p>
                <p>Show QR code to customer or ask for UPI ID for payment.</p>
                <div className="upi-options">
                  <button className="btn btn-outline">Generate QR Code</button>
                  <button className="btn btn-outline">Send Payment Link</button>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Payment */}
          {paymentMethod === 'Wallet' && (
            <div className="wallet-payment-section">
              <h4>Wallet Payment</h4>
              <div className="wallet-info">
                <p>Amount to be paid: <strong>{formatCurrency(currentBill.total)}</strong></p>
                <p>Select wallet provider and process payment.</p>
                <div className="wallet-options">
                  <button className="btn btn-outline">Paytm</button>
                  <button className="btn btn-outline">PhonePe</button>
                  <button className="btn btn-outline">Google Pay</button>
                  <button className="btn btn-outline">Amazon Pay</button>
                </div>
              </div>
            </div>
          )}

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
            disabled={processing || (paymentMethod === 'Cash' && parseFloat(amountReceived) < currentBill.total)}
          >
            <Calculator size={16} />
            {processing ? 'Processing...' : `Process ${paymentMethod} Payment`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPanel;
