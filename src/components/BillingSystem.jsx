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
  Clock,
  Search,
  Plus,
  Minus,
  Trash2,
  Edit,
  Receipt,
  DollarSign,
  TrendingUp,
  Users,
  Zap
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
            {/* Modern Header */}
            <div className="billing-header">
              <div className="header-left">
                <div className="header-title">
                  <h1>Point of Sale</h1>
                  <span className="header-subtitle">Sathya Pharmacy Billing System</span>
                </div>
              </div>
              <div className="header-right">
                <div className="header-stats">
                  <div className="quick-stat">
                    <span className="stat-value">₹12,450</span>
                    <span className="stat-label">Today's Sales</span>
                  </div>
                  <div className="quick-stat">
                    <span className="stat-value">47</span>
                    <span className="stat-label">Bills Today</span>
                  </div>
                </div>
                <div className="header-actions">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowHeldBillsModal(true)}
                  >
                    <Clock size={18} />
                    Held Bills (3)
                  </button>
                  <button
                    className={`btn btn-primary ${refreshing ? 'loading' : ''}`}
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw size={18} className={refreshing ? 'spinning' : ''} />
                    {refreshing ? 'Refreshing...' : 'New Bill'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modern Billing Interface */}
            <div className="billing-workspace">
              {/* Left Section - Customer & Item Search */}
              <div className="billing-left">
                {/* Customer Section */}
                <div className="customer-section">
                  <div className="section-header">
                    <User size={20} />
                    <h3>Customer</h3>
                  </div>
                  <CustomerPanel />
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                  <div className="section-header">
                    <Zap size={20} />
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="action-grid">
                    <button className="action-btn">
                      <Scan size={20} />
                      <span>Scan Barcode</span>
                    </button>
                    <button className="action-btn">
                      <Plus size={20} />
                      <span>Add Customer</span>
                    </button>
                    <button className="action-btn">
                      <Receipt size={20} />
                      <span>Print Last</span>
                    </button>
                    <button className="action-btn">
                      <Save size={20} />
                      <span>Hold Bill</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Center Section - Item Entry & Bill Items */}
              <div className="billing-center">
                {/* Item Search & Entry */}
                <div className="item-entry-section">
                  <div className="section-header">
                    <Package size={20} />
                    <h3>Add Items</h3>
                    <button className="btn btn-ghost btn-sm">
                      <Scan size={16} />
                      Scan
                    </button>
                  </div>
                  <ItemEntry />
                </div>

                {/* Bill Items Table */}
                <div className="bill-items-section">
                  <div className="section-header">
                    <ShoppingCart size={20} />
                    <h3>Bill Items</h3>
                    <span className="item-count">3 items</span>
                  </div>
                  <ItemTable />
                </div>
              </div>

              {/* Right Section - Bill Summary & Payment */}
              <div className="billing-right">
                {/* Bill Summary */}
                <div className="bill-summary-section">
                  <div className="section-header">
                    <Calculator size={20} />
                    <h3>Bill Summary</h3>
                  </div>
                  <BillSummary />
                </div>

                {/* Payment Actions */}
                <div className="payment-section">
                  <div className="payment-buttons">
                    <button
                      className="btn btn-outline btn-lg"
                      onClick={() => {/* Hold bill logic */}}
                    >
                      <Save size={20} />
                      Hold Bill
                    </button>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => setShowPaymentPanel(true)}
                    >
                      <CreditCard size={20} />
                      Process Payment
                    </button>
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
