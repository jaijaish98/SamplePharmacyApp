import { useState } from 'react';
import { Printer, Download, Mail, Copy } from 'lucide-react';
import { format } from 'date-fns';

const InvoiceModal = ({ invoice, onClose }) => {
  const [printing, setPrinting] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handlePrint = async () => {
    setPrinting(true);
    // Simulate printing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPrinting(false);
    alert('Invoice printed successfully!');
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  const handleEmailInvoice = async () => {
    if (!invoice.customer?.email) {
      alert('Customer email not available');
      return;
    }
    
    setEmailSending(true);
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    setEmailSending(false);
    alert(`Invoice emailed to ${invoice.customer.email}`);
  };

  const handleCopyInvoice = () => {
    // Copy invoice details to clipboard
    const invoiceText = `
Invoice: ${invoice.invoiceNumber}
Date: ${format(new Date(invoice.date), 'dd/MM/yyyy HH:mm')}
Customer: ${invoice.customer?.name || 'Walk-in Customer'}
Total: ${formatCurrency(invoice.total)}
    `;
    navigator.clipboard.writeText(invoiceText);
    alert('Invoice details copied to clipboard');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content invoice-modal">
        <div className="modal-header">
          <h3>Invoice Generated</h3>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Invoice Preview */}
          <div className="invoice-preview">
            {/* Pharmacy Header */}
            <div className="invoice-header">
              <div className="pharmacy-info">
                <h2>Sathya Pharmacy</h2>
                <p>123 Main Street, Mumbai, Maharashtra 400001</p>
                <p>Phone: +91 98765 43210 | Email: info@sathyapharmacy.com</p>
                <p>Drug License No: DL-MH-12345 | GST No: 27ABCDE1234F1Z5</p>
              </div>
              <div className="invoice-details">
                <h3>INVOICE</h3>
                <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> {format(new Date(invoice.date), 'dd/MM/yyyy')}</p>
                <p><strong>Time:</strong> {format(new Date(invoice.date), 'HH:mm:ss')}</p>
                <p><strong>Cashier:</strong> {invoice.cashier}</p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="customer-section">
              <h4>Bill To:</h4>
              <div className="customer-info">
                <p><strong>Name:</strong> {invoice.customer?.name || 'Walk-in Customer'}</p>
                {invoice.customer?.phone && (
                  <p><strong>Phone:</strong> {invoice.customer.phone}</p>
                )}
                {invoice.customer?.email && (
                  <p><strong>Email:</strong> {invoice.customer.email}</p>
                )}
                {invoice.prescriptionId && (
                  <p><strong>Prescription ID:</strong> {invoice.prescriptionId}</p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="items-section">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Item Description</th>
                    <th>Batch No</th>
                    <th>Expiry</th>
                    <th>Qty</th>
                    <th>MRP</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="item-description">
                          <div className="item-name">{item.name}</div>
                          <div className="item-brand">{item.brand}</div>
                        </div>
                      </td>
                      <td>{item.batchNumber}</td>
                      <td>{format(new Date(item.expiryDate), 'MM/yy')}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.mrp)}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="totals-section">
              <div className="totals-grid">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="total-row">
                    <span>Discount:</span>
                    <span>-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                <div className="total-row">
                  <span>Taxable Amount:</span>
                  <span>{formatCurrency(invoice.subtotal - invoice.discount)}</span>
                </div>
                {invoice.gstDetails && (
                  <>
                    <div className="total-row">
                      <span>CGST (9%):</span>
                      <span>{formatCurrency(invoice.gstDetails.cgst)}</span>
                    </div>
                    <div className="total-row">
                      <span>SGST (9%):</span>
                      <span>{formatCurrency(invoice.gstDetails.sgst)}</span>
                    </div>
                  </>
                )}
                <div className="total-row grand-total">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="payment-section">
              <div className="payment-info">
                <p><strong>Payment Method:</strong> {invoice.paymentMethod}</p>
                <p><strong>Amount Paid:</strong> {formatCurrency(invoice.amountPaid || invoice.total)}</p>
                {invoice.changeReturned > 0 && (
                  <p><strong>Change Returned:</strong> {formatCurrency(invoice.changeReturned)}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="invoice-footer">
              <div className="footer-notes">
                {invoice.notes && (
                  <p><strong>Notes:</strong> {invoice.notes}</p>
                )}
                <p>Thank you for your business!</p>
                <p>For any queries, please contact us at +91 98765 43210</p>
              </div>
              <div className="footer-legal">
                <p>This is a computer generated invoice and does not require signature.</p>
                <p>Goods once sold cannot be returned without valid reason.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="invoice-actions">
            <button 
              className={`btn btn-outline ${printing ? 'loading' : ''}`}
              onClick={handlePrint}
              disabled={printing}
            >
              <Printer size={16} />
              {printing ? 'Printing...' : 'Print Invoice'}
            </button>
            
            <button 
              className="btn btn-outline"
              onClick={handleDownloadPDF}
            >
              <Download size={16} />
              Download PDF
            </button>
            
            {invoice.customer?.email && (
              <button 
                className={`btn btn-outline ${emailSending ? 'loading' : ''}`}
                onClick={handleEmailInvoice}
                disabled={emailSending}
              >
                <Mail size={16} />
                {emailSending ? 'Sending...' : 'Email Invoice'}
              </button>
            )}
            
            <button 
              className="btn btn-outline"
              onClick={handleCopyInvoice}
            >
              <Copy size={16} />
              Copy Details
            </button>
            
            <button 
              className="btn btn-primary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
