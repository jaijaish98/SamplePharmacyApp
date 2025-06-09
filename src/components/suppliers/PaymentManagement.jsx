import { useState } from 'react';
import { CreditCard, Plus, Search, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useSuppliers } from '../../contexts/SupplierContext';

const PaymentManagement = () => {
  const { payments, suppliers, purchaseOrders, loading } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getOutstandingPayments = () => {
    const outstanding = [];
    
    purchaseOrders.forEach(po => {
      if (po.status === 'Delivered') {
        const paidAmount = payments
          .filter(p => p.purchaseOrderId === po.id)
          .reduce((sum, p) => sum + p.amount, 0);
        
        const outstandingAmount = po.totalAmount - paidAmount;
        
        if (outstandingAmount > 0) {
          const supplier = suppliers.find(s => s.id === po.supplierId);
          const daysSinceDelivery = differenceInDays(new Date(), new Date(po.actualDeliveryDate));
          
          outstanding.push({
            ...po,
            supplier,
            paidAmount,
            outstandingAmount,
            daysSinceDelivery,
            isOverdue: daysSinceDelivery > 30
          });
        }
      }
    });
    
    return outstanding;
  };

  const outstandingPayments = getOutstandingPayments();
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.purchaseOrderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="supplier-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-container">
      <div className="supplier-section">
        <div className="section-header">
          <div>
            <h3>Payment Management</h3>
            <p>Track payments and outstanding dues to suppliers</p>
          </div>
          <button className="btn btn-primary">
            <Plus size={16} />
            Record Payment
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="payment-tabs">
        <button 
          className={`tab-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All Payments
        </button>
        <button 
          className={`tab-btn ${filterType === 'outstanding' ? 'active' : ''}`}
          onClick={() => setFilterType('outstanding')}
        >
          Outstanding ({outstandingPayments.length})
        </button>
        <button 
          className={`tab-btn ${filterType === 'overdue' ? 'active' : ''}`}
          onClick={() => setFilterType('overdue')}
        >
          Overdue ({outstandingPayments.filter(p => p.isOverdue).length})
        </button>
      </div>

      {/* Search */}
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by supplier or PO ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Outstanding Payments */}
      {filterType === 'outstanding' && (
        <div className="outstanding-section">
          <h4>Outstanding Payments</h4>
          <div className="outstanding-list">
            {outstandingPayments.map((payment) => (
              <div key={payment.id} className={`payment-card ${payment.isOverdue ? 'overdue' : ''}`}>
                <div className="payment-header">
                  <div>
                    <div className="payment-supplier">{payment.supplier.name}</div>
                    <div className="payment-po">PO: {payment.id}</div>
                    <div className="payment-date">
                      Delivered: {format(new Date(payment.actualDeliveryDate), 'dd/MM/yyyy')}
                    </div>
                  </div>
                  <div>
                    <div className="payment-amount outstanding">
                      {formatCurrency(payment.outstandingAmount)}
                    </div>
                    {payment.isOverdue && (
                      <div className="overdue-badge">
                        <AlertTriangle size={14} />
                        Overdue
                      </div>
                    )}
                  </div>
                </div>

                <div className="payment-details">
                  <div className="detail-item">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(payment.totalAmount)}</span>
                  </div>
                  <div className="detail-item">
                    <span>Paid Amount:</span>
                    <span>{formatCurrency(payment.paidAmount)}</span>
                  </div>
                  <div className="detail-item">
                    <span>Days Since Delivery:</span>
                    <span>{payment.daysSinceDelivery} days</span>
                  </div>
                  <div className="detail-item">
                    <span>Payment Terms:</span>
                    <span>{payment.supplier.paymentTerms}</span>
                  </div>
                </div>

                <div className="payment-actions">
                  <button className="btn btn-primary btn-small">
                    <CreditCard size={14} />
                    Make Payment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      {filterType === 'all' && (
        <div className="payment-history">
          <h4>Payment History</h4>
          <div className="payment-list">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="payment-card">
                <div className="payment-header">
                  <div>
                    <div className="payment-id">{payment.id}</div>
                    <div className="payment-supplier">{payment.supplierName}</div>
                    <div className="payment-po">PO: {payment.purchaseOrderId}</div>
                  </div>
                  <div>
                    <div className="payment-amount paid">
                      {formatCurrency(payment.amount)}
                    </div>
                    <div className="payment-mode">{payment.paymentMode}</div>
                  </div>
                </div>

                <div className="payment-details">
                  <div className="detail-item">
                    <span>Payment Date:</span>
                    <span>{format(new Date(payment.paymentDate), 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="detail-item">
                    <span>Reference:</span>
                    <span>{payment.referenceNumber}</span>
                  </div>
                  {payment.notes && (
                    <div className="detail-item">
                      <span>Notes:</span>
                      <span>{payment.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="payment-summary">
        <div className="summary-card">
          <h4>Payment Summary</h4>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">Total Paid</span>
              <span className="summary-value">
                {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Outstanding</span>
              <span className="summary-value">
                {formatCurrency(outstandingPayments.reduce((sum, p) => sum + p.outstandingAmount, 0))}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Overdue</span>
              <span className="summary-value">
                {formatCurrency(outstandingPayments.filter(p => p.isOverdue).reduce((sum, p) => sum + p.outstandingAmount, 0))}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">This Month</span>
              <span className="summary-value">
                {formatCurrency(payments.filter(p => 
                  new Date(p.paymentDate).getMonth() === new Date().getMonth()
                ).reduce((sum, p) => sum + p.amount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
