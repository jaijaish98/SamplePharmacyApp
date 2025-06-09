import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

const BillingContext = createContext();

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

// Generate mock invoice data
const generateMockInvoices = () => {
  const invoices = [];
  const paymentMethods = ['Cash', 'Card', 'UPI', 'Wallet'];
  const statuses = ['completed', 'pending', 'cancelled', 'refunded'];
  
  for (let i = 0; i < 50; i++) {
    const invoiceDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const subtotal = Math.floor(Math.random() * 2000) + 100;
    const discount = Math.floor(subtotal * (Math.random() * 0.1)); // 0-10% discount
    const gstRate = 0.18; // 18% GST
    const gstAmount = Math.floor((subtotal - discount) * gstRate);
    const total = subtotal - discount + gstAmount;
    
    invoices.push({
      id: `INV${String(i + 1).padStart(6, '0')}`,
      invoiceNumber: `INV${String(i + 1).padStart(6, '0')}`,
      date: invoiceDate,
      customer: {
        id: Math.floor(Math.random() * 100) + 1,
        name: `Customer ${i + 1}`,
        phone: `98765${String(43210 + i).padStart(5, '0')}`,
        email: `customer${i + 1}@example.com`
      },
      items: [
        {
          id: Math.floor(Math.random() * 10) + 1,
          name: `Medicine ${i + 1}`,
          quantity: Math.floor(Math.random() * 5) + 1,
          unitPrice: Math.floor(Math.random() * 200) + 50,
          discount: Math.floor(Math.random() * 20),
          total: subtotal
        }
      ],
      subtotal: subtotal,
      discount: discount,
      gstAmount: gstAmount,
      total: total,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      cashier: 'Current User',
      notes: Math.random() > 0.7 ? 'Special instructions' : '',
      prescriptionId: Math.random() > 0.5 ? `RX${String(i + 1).padStart(4, '0')}` : null
    });
  }
  
  return invoices.sort((a, b) => b.date - a.date);
};

export const BillingProvider = ({ children }) => {
  const [currentBill, setCurrentBill] = useState({
    customer: null,
    prescription: null,
    items: [],
    subtotal: 0,
    discount: 0,
    gstAmount: 0,
    total: 0,
    paymentMethod: 'Cash',
    notes: ''
  });
  
  const [invoices, setInvoices] = useState([]);
  const [heldBills, setHeldBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    gstRate: 0.18, // 18% GST
    cgstRate: 0.09, // 9% CGST
    sgstRate: 0.09, // 9% SGST
    allowPriceEdit: false,
    allowDiscount: true,
    maxDiscountPercent: 20,
    autoCalculateGST: true,
    printAfterSale: true,
    thermalPrinter: false
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInvoices(generateMockInvoices());
      setLoading(false);
    }, 1000);
  }, []);

  // Calculate bill totals
  const calculateBillTotals = (items, discountAmount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discountedSubtotal = subtotal - discountAmount;
    const gstAmount = settings.autoCalculateGST ? Math.round(discountedSubtotal * settings.gstRate) : 0;
    const total = discountedSubtotal + gstAmount;
    
    return {
      subtotal,
      discount: discountAmount,
      gstAmount,
      total
    };
  };

  // Add item to current bill
  const addItemToBill = (item) => {
    const existingItemIndex = currentBill.items.findIndex(billItem => billItem.id === item.id);
    
    let updatedItems;
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = currentBill.items.map((billItem, index) => 
        index === existingItemIndex 
          ? { ...billItem, quantity: billItem.quantity + item.quantity }
          : billItem
      );
    } else {
      // Add new item
      updatedItems = [...currentBill.items, item];
    }
    
    const totals = calculateBillTotals(updatedItems, currentBill.discount);
    
    setCurrentBill(prev => ({
      ...prev,
      items: updatedItems,
      ...totals
    }));
  };

  // Update item in bill
  const updateBillItem = (itemId, updates) => {
    const updatedItems = currentBill.items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    const totals = calculateBillTotals(updatedItems, currentBill.discount);
    
    setCurrentBill(prev => ({
      ...prev,
      items: updatedItems,
      ...totals
    }));
  };

  // Remove item from bill
  const removeItemFromBill = (itemId) => {
    const updatedItems = currentBill.items.filter(item => item.id !== itemId);
    const totals = calculateBillTotals(updatedItems, currentBill.discount);
    
    setCurrentBill(prev => ({
      ...prev,
      items: updatedItems,
      ...totals
    }));
  };

  // Apply discount to bill
  const applyDiscount = (discountAmount) => {
    const totals = calculateBillTotals(currentBill.items, discountAmount);
    
    setCurrentBill(prev => ({
      ...prev,
      ...totals
    }));
  };

  // Set customer for current bill
  const setCustomer = (customer) => {
    setCurrentBill(prev => ({
      ...prev,
      customer
    }));
  };

  // Set prescription for current bill
  const setPrescription = (prescription) => {
    setCurrentBill(prev => ({
      ...prev,
      prescription
    }));
  };

  // Hold current bill
  const holdBill = (holdName = '') => {
    const heldBill = {
      id: `HOLD${Date.now()}`,
      name: holdName || `Hold ${heldBills.length + 1}`,
      bill: { ...currentBill },
      timestamp: new Date()
    };
    
    setHeldBills(prev => [...prev, heldBill]);
    clearCurrentBill();
    return heldBill;
  };

  // Retrieve held bill
  const retrieveHeldBill = (heldBillId) => {
    const heldBill = heldBills.find(bill => bill.id === heldBillId);
    if (heldBill) {
      setCurrentBill(heldBill.bill);
      setHeldBills(prev => prev.filter(bill => bill.id !== heldBillId));
      return true;
    }
    return false;
  };

  // Clear current bill
  const clearCurrentBill = () => {
    setCurrentBill({
      customer: null,
      prescription: null,
      items: [],
      subtotal: 0,
      discount: 0,
      gstAmount: 0,
      total: 0,
      paymentMethod: 'Cash',
      notes: ''
    });
  };

  // Process payment and generate invoice
  const processPayment = async (paymentDetails) => {
    const invoice = {
      id: `INV${String(invoices.length + 1).padStart(6, '0')}`,
      invoiceNumber: `INV${String(invoices.length + 1).padStart(6, '0')}`,
      date: new Date(),
      customer: currentBill.customer,
      prescription: currentBill.prescription,
      items: currentBill.items,
      subtotal: currentBill.subtotal,
      discount: currentBill.discount,
      gstAmount: currentBill.gstAmount,
      total: currentBill.total,
      paymentMethod: paymentDetails.method,
      amountPaid: paymentDetails.amountPaid,
      changeReturned: paymentDetails.changeReturned || 0,
      status: 'completed',
      cashier: 'Current User',
      notes: currentBill.notes,
      gstDetails: {
        cgst: Math.round(currentBill.gstAmount / 2),
        sgst: Math.round(currentBill.gstAmount / 2),
        totalGst: currentBill.gstAmount
      }
    };
    
    // Add to invoices
    setInvoices(prev => [invoice, ...prev]);
    
    // Clear current bill
    clearCurrentBill();
    
    return invoice;
  };

  // Get invoice by ID
  const getInvoiceById = (invoiceId) => {
    return invoices.find(invoice => invoice.id === invoiceId);
  };

  // Search invoices
  const searchInvoices = (searchTerm, filters = {}) => {
    return invoices.filter(invoice => {
      const matchesSearch = !searchTerm || 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer?.phone.includes(searchTerm);
      
      const matchesStatus = !filters.status || invoice.status === filters.status;
      const matchesPaymentMethod = !filters.paymentMethod || invoice.paymentMethod === filters.paymentMethod;
      
      return matchesSearch && matchesStatus && matchesPaymentMethod;
    });
  };

  // Get billing analytics
  const getBillingAnalytics = () => {
    const today = new Date();
    const todayInvoices = invoices.filter(invoice => 
      format(invoice.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    );
    
    const todayRevenue = todayInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const totalInvoices = todayInvoices.length;
    const averageOrderValue = totalInvoices > 0 ? todayRevenue / totalInvoices : 0;
    
    return {
      todayRevenue,
      totalInvoices,
      averageOrderValue,
      heldBillsCount: heldBills.length
    };
  };

  const value = {
    currentBill,
    invoices,
    heldBills,
    settings,
    loading,
    addItemToBill,
    updateBillItem,
    removeItemFromBill,
    applyDiscount,
    setCustomer,
    setPrescription,
    holdBill,
    retrieveHeldBill,
    clearCurrentBill,
    processPayment,
    getInvoiceById,
    searchInvoices,
    getBillingAnalytics,
    setSettings
  };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
};
