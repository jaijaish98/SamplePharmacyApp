import React, { useState, useEffect } from 'react';
import {
  Search,
  Scan,
  Plus,
  Minus,
  Trash2,
  User,
  Phone,
  Mail,
  Upload,
  Camera,
  ShoppingCart,
  CreditCard,
  Smartphone,
  Wallet,
  Printer,
  Download,
  Send,
  Save,
  Clock,
  Receipt,
  Calculator,
  Edit3,
  Check,
  X
} from 'lucide-react';
import CustomerPanel from './billing/CustomerPanel';
import ItemEntry from './billing/ItemEntry';
import ItemTable from './billing/ItemTable';
import BillSummary from './billing/BillSummary';
import PaymentPanel from './billing/PaymentPanel';
import InvoiceModal from './billing/InvoiceModal';
import './BillingSystem.css';

const BillingSystem = () => {
  const [customer, setCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [billSummary, setBillSummary] = useState({
    subtotal: 0,
    discount: 0,
    gst: 0,
    total: 0
  });
  const [payment, setPayment] = useState({
    method: 'cash',
    amount: 0,
    change: 0
  });
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [savedBills, setSavedBills] = useState([]);
  const [isHoldMode, setIsHoldMode] = useState(false);

  // Sample medicine data
  const [medicines] = useState([
    {
      id: 1,
      name: 'Paracetamol 500mg',
      brand: 'Crocin',
      composition: 'Paracetamol',
      mrp: 25.50,
      sellingPrice: 23.00,
      batchNo: 'PCM001',
      expiry: '2025-12-31',
      stock: 150,
      gstRate: 12
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      brand: 'Amoxil',
      composition: 'Amoxicillin',
      mrp: 85.00,
      sellingPrice: 78.00,
      batchNo: 'AMX002',
      expiry: '2025-08-15',
      stock: 75,
      gstRate: 12
    },
    {
      id: 3,
      name: 'Cetirizine 10mg',
      brand: 'Zyrtec',
      composition: 'Cetirizine HCl',
      mrp: 45.00,
      sellingPrice: 42.00,
      batchNo: 'CTZ003',
      expiry: '2026-03-20',
      stock: 200,
      gstRate: 12
    },
    {
      id: 4,
      name: 'Omeprazole 20mg',
      brand: 'Prilosec',
      composition: 'Omeprazole',
      mrp: 120.00,
      sellingPrice: 110.00,
      batchNo: 'OMP004',
      expiry: '2025-11-10',
      stock: 90,
      gstRate: 12
    },
    {
      id: 5,
      name: 'Metformin 500mg',
      brand: 'Glucophage',
      composition: 'Metformin HCl',
      mrp: 65.00,
      sellingPrice: 60.00,
      batchNo: 'MET005',
      expiry: '2026-01-25',
      stock: 120,
      gstRate: 12
    }
  ]);

  // Calculate bill summary whenever items change
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
    const totalDiscount = items.reduce((sum, item) => sum + (item.discount || 0), 0);
    const gst = items.reduce((sum, item) => {
      const itemTotal = (item.quantity * item.sellingPrice) - (item.discount || 0);
      return sum + (itemTotal * (item.gstRate / 100));
    }, 0);
    const total = subtotal - totalDiscount + gst;

    setBillSummary({
      subtotal: subtotal.toFixed(2),
      discount: totalDiscount.toFixed(2),
      gst: gst.toFixed(2),
      total: total.toFixed(2)
    });
  }, [items]);

  const addItem = (medicine, quantity = 1) => {
    const existingItemIndex = items.findIndex(item => item.id === medicine.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems);
    } else {
      const newItem = {
        ...medicine,
        quantity,
        discount: 0
      };
      setItems([...items, newItem]);
    }
  };

  const updateItem = (itemId, field, value) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const removeItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const clearBill = () => {
    setItems([]);
    setCustomer(null);
    setPayment({ method: 'cash', amount: 0, change: 0 });
    setIsHoldMode(false);
  };

  const holdBill = () => {
    const billToHold = {
      id: Date.now(),
      customer,
      items,
      billSummary,
      timestamp: new Date().toISOString(),
      status: 'held'
    };
    setSavedBills([...savedBills, billToHold]);
    clearBill();
    setIsHoldMode(false);
  };

  const processBill = () => {
    const newBill = {
      id: Date.now(),
      invoiceNo: `INV-${Date.now()}`,
      customer,
      items,
      billSummary,
      payment,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setCurrentBill(newBill);
    setShowInvoice(true);
    setSavedBills([...savedBills, newBill]);
  };

  return (
    <div className="billing-system">
      <div className="billing-header">
        <h1>Billing System</h1>
        <div className="billing-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setIsHoldMode(!isHoldMode)}
          >
            <Clock size={18} />
            {isHoldMode ? 'Cancel Hold' : 'Hold Bill'}
          </button>
          <button className="btn btn-outline" onClick={clearBill}>
            <X size={18} />
            Clear
          </button>
        </div>
      </div>

      <div className="billing-layout">
        {/* Top Panel - Customer Information */}
        <div className="billing-top-panel">
          <CustomerPanel 
            customer={customer}
            setCustomer={setCustomer}
          />
        </div>

        {/* Middle Section - Item Entry and Table */}
        <div className="billing-middle-section">
          <div className="item-entry-section">
            <ItemEntry 
              medicines={medicines}
              onAddItem={addItem}
            />
          </div>
          
          <div className="item-table-section">
            <ItemTable 
              items={items}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />
          </div>
        </div>

        {/* Bottom Panel - Bill Summary and Payment */}
        <div className="billing-bottom-panel">
          <div className="bill-summary-section">
            <BillSummary 
              billSummary={billSummary}
              itemCount={items.length}
            />
          </div>
          
          <div className="payment-section">
            <PaymentPanel 
              billSummary={billSummary}
              payment={payment}
              setPayment={setPayment}
              onProcessBill={processBill}
              onHoldBill={holdBill}
              isHoldMode={isHoldMode}
              disabled={items.length === 0}
            />
          </div>
        </div>
      </div>

      {/* Held Bills Sidebar */}
      {savedBills.filter(bill => bill.status === 'held').length > 0 && (
        <div className="held-bills-sidebar">
          <h3>Held Bills ({savedBills.filter(bill => bill.status === 'held').length})</h3>
          {savedBills.filter(bill => bill.status === 'held').map(bill => (
            <div key={bill.id} className="held-bill-item">
              <div className="held-bill-info">
                <p>{bill.customer?.name || 'Walk-in Customer'}</p>
                <p>₹{bill.billSummary.total}</p>
                <p>{new Date(bill.timestamp).toLocaleTimeString()}</p>
              </div>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setCustomer(bill.customer);
                  setItems(bill.items);
                  setSavedBills(savedBills.filter(b => b.id !== bill.id));
                }}
              >
                Resume
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && currentBill && (
        <InvoiceModal 
          bill={currentBill}
          onClose={() => {
            setShowInvoice(false);
            clearBill();
          }}
        />
      )}
    </div>
  );
};

export default BillingSystem;
