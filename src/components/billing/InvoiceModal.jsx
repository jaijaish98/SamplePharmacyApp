import React from 'react';
import {
  X,
  Printer,
  Download,
  Send,
  Receipt,
  Calendar,
  User,
  Phone,
  Package
} from 'lucide-react';
import './InvoiceModal.css';

const InvoiceModal = ({ bill, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  const handleEmail = () => {
    // In a real implementation, this would open email composer or send email
    alert('Email functionality would be implemented here');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="invoice-modal-overlay">
      <div className="invoice-modal">
        <div className="invoice-header">
          <h2>Invoice Generated</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="invoice-actions">
          <button className="btn btn-outline" onClick={handlePrint}>
            <Printer size={16} />
            Print
          </button>
          <button className="btn btn-outline" onClick={handleDownload}>
            <Download size={16} />
            Download PDF
          </button>
          <button className="btn btn-outline" onClick={handleEmail}>
            <Send size={16} />
            Email
          </button>
        </div>

        <div className="invoice-content" id="invoice-print">
          {/* Pharmacy Header */}
          <div className="pharmacy-header">
            <div className="pharmacy-logo">
              <Package size={32} />
            </div>
            <div className="pharmacy-info">
              <h1>Sathya Pharmacy</h1>
              <p>123 Main Street, Chennai - 600001</p>
              <p>Phone: +91 98765 43210 | Email: info@sathyapharmacy.com</p>
              <p>Drug License No: DL-TN-12345 | GST No: 33ABCDE1234F1Z5</p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="invoice-details">
            <div className="invoice-meta">
              <div className="invoice-number">
                <h3>Invoice #{bill.invoiceNo}</h3>
                <p className="invoice-date">
                  <Calendar size={16} />
                  {formatDate(bill.timestamp)}
                </p>
              </div>
              
              <div className="customer-details">
                <h4>Bill To:</h4>
                {bill.customer ? (
                  <div className="customer-info">
                    <p className="customer-name">
                      <User size={16} />
                      {bill.customer.name}
                    </p>
                    {bill.customer.phone && (
                      <p className="customer-phone">
                        <Phone size={16} />
                        {bill.customer.phone}
                      </p>
                    )}
                    {bill.customer.address && (
                      <p className="customer-address">{bill.customer.address}</p>
                    )}
                  </div>
                ) : (
                  <p>Walk-in Customer</p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="invoice-items">
            <table className="items-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Medicine Details</th>
                  <th>Batch No</th>
                  <th>Expiry</th>
                  <th>Qty</th>
                  <th>MRP</th>
                  <th>Rate</th>
                  <th>Discount</th>
                  <th>GST</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, index) => {
                  const itemTotal = (item.quantity * item.sellingPrice) - (item.discount || 0);
                  const gstAmount = itemTotal * (item.gstRate / 100);
                  const finalAmount = itemTotal + gstAmount;
                  
                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="item-details">
                          <strong>{item.name}</strong>
                          <br />
                          <small>{item.brand} - {item.composition}</small>
                        </div>
                      </td>
                      <td>{item.batchNo}</td>
                      <td>{new Date(item.expiry).toLocaleDateString()}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.mrp}</td>
                      <td>₹{item.sellingPrice}</td>
                      <td>₹{(item.discount || 0).toFixed(2)}</td>
                      <td>{item.gstRate}%</td>
                      <td>₹{finalAmount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary */}
          <div className="invoice-summary">
            <div className="summary-section">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{bill.billSummary.subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Discount:</span>
                <span>-₹{bill.billSummary.discount}</span>
              </div>
              <div className="summary-row">
                <span>GST:</span>
                <span>+₹{bill.billSummary.gst}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Amount:</span>
                <span>₹{bill.billSummary.total}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="payment-details">
            <h4>Payment Details</h4>
            <div className="payment-info">
              <div className="payment-method">
                <span>Payment Method:</span>
                <span className="method-badge">{bill.payment.method.toUpperCase()}</span>
              </div>
              <div className="payment-amount">
                <span>Amount Paid:</span>
                <span>₹{bill.payment.amount.toFixed(2)}</span>
              </div>
              {bill.payment.change > 0 && (
                <div className="payment-change">
                  <span>Change Returned:</span>
                  <span>₹{bill.payment.change.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="invoice-footer">
            <div className="footer-note">
              <p><strong>Thank you for your business!</strong></p>
              <p>For any queries, please contact us at +91 98765 43210</p>
              <p>This is a computer-generated invoice and does not require a signature.</p>
            </div>
            
            <div className="footer-legal">
              <p><small>Terms & Conditions Apply | Goods once sold cannot be returned</small></p>
              <p><small>This invoice is subject to Chennai jurisdiction only</small></p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            <Receipt size={16} />
            New Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
