import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Smartphone,
  Wallet,
  DollarSign,
  Calculator,
  Check,
  Clock,
  ArrowRight
} from 'lucide-react';
import './PaymentPanel.css';

const PaymentPanel = ({ 
  billSummary, 
  payment, 
  setPayment, 
  onProcessBill, 
  onHoldBill, 
  isHoldMode, 
  disabled 
}) => {
  const [splitPayment, setSplitPayment] = useState(false);
  const [splitAmounts, setSplitAmounts] = useState({
    cash: 0,
    card: 0,
    upi: 0
  });

  const totalAmount = parseFloat(billSummary.total);

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: DollarSign, color: '#10b981' },
    { id: 'card', label: 'Card', icon: CreditCard, color: '#3b82f6' },
    { id: 'upi', label: 'UPI', icon: Smartphone, color: '#8b5cf6' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, color: '#f59e0b' }
  ];

  // Calculate change for cash payments
  useEffect(() => {
    if (payment.method === 'cash' && payment.amount > 0) {
      const change = payment.amount - totalAmount;
      setPayment(prev => ({ ...prev, change: Math.max(0, change) }));
    } else {
      setPayment(prev => ({ ...prev, change: 0 }));
    }
  }, [payment.amount, payment.method, totalAmount, setPayment]);

  const handlePaymentMethodChange = (method) => {
    setPayment({
      method,
      amount: method === 'cash' ? 0 : totalAmount,
      change: 0
    });
    setSplitPayment(false);
  };

  const handleAmountChange = (amount) => {
    setPayment(prev => ({ ...prev, amount: parseFloat(amount) || 0 }));
  };

  const handleSplitPaymentToggle = () => {
    setSplitPayment(!splitPayment);
    if (!splitPayment) {
      setSplitAmounts({
        cash: totalAmount / 2,
        card: totalAmount / 2,
        upi: 0
      });
    }
  };

  const handleSplitAmountChange = (method, amount) => {
    setSplitAmounts(prev => ({ ...prev, [method]: parseFloat(amount) || 0 }));
  };

  const getSplitTotal = () => {
    return Object.values(splitAmounts).reduce((sum, amount) => sum + amount, 0);
  };

  const isPaymentValid = () => {
    if (splitPayment) {
      return Math.abs(getSplitTotal() - totalAmount) < 0.01;
    }
    
    if (payment.method === 'cash') {
      return payment.amount >= totalAmount;
    }
    
    return payment.amount === totalAmount;
  };

  const getQuickAmounts = () => {
    const amounts = [
      Math.ceil(totalAmount),
      Math.ceil(totalAmount / 100) * 100,
      Math.ceil(totalAmount / 500) * 500,
      Math.ceil(totalAmount / 1000) * 1000
    ];
    return [...new Set(amounts)].sort((a, b) => a - b);
  };

  return (
    <div className="payment-panel">
      <div className="payment-header">
        <h3>Payment</h3>
        <div className="payment-amount">
          ₹{billSummary.total}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="payment-methods">
        <h4>Payment Method</h4>
        <div className="payment-method-grid">
          {paymentMethods.map(method => {
            const IconComponent = method.icon;
            return (
              <button
                key={method.id}
                className={`payment-method-btn ${payment.method === method.id ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange(method.id)}
                style={{ '--method-color': method.color }}
              >
                <IconComponent size={20} />
                <span>{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Split Payment Toggle */}
      <div className="split-payment-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={splitPayment}
            onChange={handleSplitPaymentToggle}
          />
          <span className="toggle-slider"></span>
          Split Payment
        </label>
      </div>

      {/* Payment Amount Section */}
      {!splitPayment ? (
        <div className="payment-amount-section">
          <h4>Amount</h4>
          
          {payment.method === 'cash' && (
            <div className="quick-amounts">
              {getQuickAmounts().map(amount => (
                <button
                  key={amount}
                  className="quick-amount-btn"
                  onClick={() => handleAmountChange(amount)}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          )}
          
          <div className="amount-input-container">
            <input
              type="number"
              value={payment.amount || ''}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount"
              className="amount-input"
              step="0.01"
              min="0"
            />
            <span className="currency-symbol">₹</span>
          </div>

          {payment.method === 'cash' && payment.change > 0 && (
            <div className="change-display">
              <div className="change-label">Change to return:</div>
              <div className="change-amount">₹{payment.change.toFixed(2)}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="split-payment-section">
          <h4>Split Payment</h4>
          <div className="split-amounts">
            {Object.entries(splitAmounts).map(([method, amount]) => {
              const methodInfo = paymentMethods.find(m => m.id === method);
              const IconComponent = methodInfo.icon;
              
              return (
                <div key={method} className="split-amount-row">
                  <div className="split-method">
                    <IconComponent size={16} />
                    <span>{methodInfo.label}</span>
                  </div>
                  <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => handleSplitAmountChange(method, e.target.value)}
                    className="split-amount-input"
                    step="0.01"
                    min="0"
                  />
                </div>
              );
            })}
          </div>
          
          <div className="split-summary">
            <div className="split-total">
              <span>Total: ₹{getSplitTotal().toFixed(2)}</span>
              <span className={`split-status ${Math.abs(getSplitTotal() - totalAmount) < 0.01 ? 'valid' : 'invalid'}`}>
                {Math.abs(getSplitTotal() - totalAmount) < 0.01 ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="payment-actions">
        {isHoldMode ? (
          <button
            className="btn btn-primary btn-large"
            onClick={onHoldBill}
            disabled={disabled}
          >
            <Clock size={18} />
            Hold Bill
          </button>
        ) : (
          <>
            <button
              className="btn btn-outline"
              onClick={onHoldBill}
              disabled={disabled}
            >
              <Clock size={16} />
              Hold
            </button>
            <button
              className="btn btn-primary btn-large"
              onClick={onProcessBill}
              disabled={disabled || !isPaymentValid()}
            >
              <Check size={18} />
              Process Payment
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Payment Status */}
      {!isPaymentValid() && !disabled && (
        <div className="payment-status error">
          {splitPayment 
            ? 'Split amounts must equal the total bill amount'
            : payment.method === 'cash' 
              ? 'Cash amount must be greater than or equal to bill total'
              : 'Payment amount must equal bill total'
          }
        </div>
      )}
    </div>
  );
};

export default PaymentPanel;
