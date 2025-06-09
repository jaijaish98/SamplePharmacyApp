import { useState } from 'react';
import { 
  ShoppingCart, 
  User, 
  Package, 
  CreditCard, 
  FileText, 
  Scan,
  Save,
  Printer,
  RefreshCw,
  Calculator,
  Clock
} from 'lucide-react';
import { BillingProvider } from '../contexts/BillingContext';
import { StockProvider } from '../contexts/StockContext';
import { CustomerProvider } from '../contexts/CustomerContext';
import CustomerPanel from './billing/CustomerPanel';
import ItemEntry from './billing/ItemEntry';
import ItemTable from './billing/ItemTable';
import BillSummary from './billing/BillSummary';
import PaymentPanel from './billing/PaymentPanel';
import InvoiceModal from './billing/InvoiceModal';
import HeldBillsModal from './billing/HeldBillsModal';
import './BillingSystem.css';

const BillingSystem = () => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showHeldBillsModal, setShowHeldBillsModal] = useState(false);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handlePaymentComplete = (invoice) => {
    setGeneratedInvoice(invoice);
    setShowPaymentPanel(false);
    setShowInvoiceModal(true);
  };

  return (
    <StockProvider>
      <CustomerProvider>
        <BillingProvider>
          <div className="billing-system">
            {/* Header Section */}
            <div className="billing-header">
              <div className="header-content">
                <h1>Billing System</h1>
                <p>Complete point-of-sale system with customer management, inventory integration, and invoice generation</p>
              </div>
              <div className="header-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowHeldBillsModal(true)}
                >
                  <Clock size={20} />
                  Held Bills
                </button>
                <button 
                  className={`btn btn-secondary ${refreshing ? 'loading' : ''}`}
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw size={20} className={refreshing ? 'spinning' : ''} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="billing-stats">
              <div className="stat-card primary">
                <div className="stat-icon">
                  <ShoppingCart size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">₹12,450</div>
                  <div className="stat-label">Today's Sales</div>
                  <div className="stat-change up">+18% from yesterday</div>
                </div>
              </div>
              
              <div className="stat-card success">
                <div className="stat-icon">
                  <FileText size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">47</div>
                  <div className="stat-label">Invoices Today</div>
                  <div className="stat-change up">+5 from yesterday</div>
                </div>
              </div>
              
              <div className="stat-card info">
                <div className="stat-icon">
                  <Calculator size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">₹265</div>
                  <div className="stat-label">Avg. Order Value</div>
                  <div className="stat-change up">+12% this week</div>
                </div>
              </div>
              
              <div className="stat-card warning">
                <div className="stat-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Held Bills</div>
                  <div className="stat-change">Awaiting completion</div>
                </div>
              </div>
            </div>

            {/* Main Billing Interface */}
            <div className="billing-interface">
              {/* Left Panel - Customer & Prescription */}
              <div className="billing-left-panel">
                <div className="panel-section">
                  <div className="section-header">
                    <User size={20} />
                    <h3>Customer Information</h3>
                  </div>
                  <CustomerPanel />
                </div>
              </div>

              {/* Center Panel - Item Entry & Table */}
              <div className="billing-center-panel">
                <div className="panel-section">
                  <div className="section-header">
                    <Package size={20} />
                    <h3>Medicine/Item Entry</h3>
                    <button className="btn btn-outline btn-small">
                      <Scan size={16} />
                      Scan Barcode
                    </button>
                  </div>
                  <ItemEntry />
                </div>

                <div className="panel-section">
                  <div className="section-header">
                    <ShoppingCart size={20} />
                    <h3>Bill Items</h3>
                  </div>
                  <ItemTable />
                </div>
              </div>

              {/* Right Panel - Bill Summary & Payment */}
              <div className="billing-right-panel">
                <div className="panel-section">
                  <div className="section-header">
                    <Calculator size={20} />
                    <h3>Bill Summary</h3>
                  </div>
                  <BillSummary />
                </div>

                <div className="panel-section">
                  <div className="section-header">
                    <CreditCard size={20} />
                    <h3>Payment</h3>
                  </div>
                  <div className="payment-actions">
                    <button 
                      className="btn btn-outline"
                      onClick={() => {/* Hold bill logic */}}
                    >
                      <Save size={16} />
                      Hold Bill
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowPaymentPanel(true)}
                    >
                      <CreditCard size={16} />
                      Process Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="quick-actions-bar">
              <div className="action-group">
                <h4>Quick Actions</h4>
                <div className="action-buttons">
                  <button className="btn btn-outline btn-small">
                    <FileText size={16} />
                    New Bill
                  </button>
                  <button className="btn btn-outline btn-small">
                    <Scan size={16} />
                    Scan Item
                  </button>
                  <button className="btn btn-outline btn-small">
                    <User size={16} />
                    Add Customer
                  </button>
                  <button className="btn btn-outline btn-small">
                    <Printer size={16} />
                    Reprint Last
                  </button>
                </div>
              </div>
              
              <div className="action-group">
                <h4>Recent Activity</h4>
                <div className="recent-activity">
                  <div className="activity-item">
                    <span className="activity-time">2 min ago</span>
                    <span className="activity-text">Invoice INV000047 - ₹285</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">5 min ago</span>
                    <span className="activity-text">Customer added - John Doe</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">8 min ago</span>
                    <span className="activity-text">Bill held - Hold 3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modals */}
            {showPaymentPanel && (
              <PaymentPanel 
                onClose={() => setShowPaymentPanel(false)}
                onPaymentComplete={handlePaymentComplete}
              />
            )}

            {showInvoiceModal && generatedInvoice && (
              <InvoiceModal 
                invoice={generatedInvoice}
                onClose={() => {
                  setShowInvoiceModal(false);
                  setGeneratedInvoice(null);
                }}
              />
            )}

            {showHeldBillsModal && (
              <HeldBillsModal 
                onClose={() => setShowHeldBillsModal(false)}
              />
            )}
          </div>
        </BillingProvider>
      </CustomerProvider>
    </StockProvider>
  );
};

export default BillingSystem;
