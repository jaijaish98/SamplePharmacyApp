import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, subDays, addDays, differenceInDays } from 'date-fns';

const SupplierContext = createContext();

export const useSuppliers = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSuppliers must be used within a SupplierProvider');
  }
  return context;
};

// Mock data generators
const generateMockSuppliers = () => {
  const suppliers = [];
  const supplierTypes = ['Wholesaler', 'Manufacturer', 'Local'];
  const paymentTerms = ['Net 15', 'Net 30', 'Net 45', 'COD', 'Advance'];
  
  const supplierData = [
    { name: 'MedPlus Distributors', type: 'Wholesaler', contact: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@medplus.com' },
    { name: 'PharmaCorp Ltd', type: 'Manufacturer', contact: 'Priya Sharma', phone: '9876543211', email: 'priya@pharmacorp.com' },
    { name: 'HealthMeds Supply', type: 'Wholesaler', contact: 'Amit Patel', phone: '9876543212', email: 'amit@healthmeds.com' },
    { name: 'Local Medical Store', type: 'Local', contact: 'Sunita Devi', phone: '9876543213', email: 'sunita@localmed.com' },
    { name: 'Global Pharma Inc', type: 'Manufacturer', contact: 'Ravi Gupta', phone: '9876543214', email: 'ravi@globalpharma.com' },
    { name: 'Metro Medical Supplies', type: 'Wholesaler', contact: 'Kavita Singh', phone: '9876543215', email: 'kavita@metromedical.com' },
    { name: 'Apex Pharmaceuticals', type: 'Manufacturer', contact: 'Deepak Joshi', phone: '9876543216', email: 'deepak@apexpharma.com' },
    { name: 'City Drug Distributors', type: 'Local', contact: 'Neha Agarwal', phone: '9876543217', email: 'neha@citydrug.com' }
  ];

  supplierData.forEach((supplier, index) => {
    const deliveryTime = Math.floor(Math.random() * 10) + 1;
    const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
    const totalPurchases = Math.floor(Math.random() * 500000) + 50000;
    const outstandingAmount = Math.floor(Math.random() * 50000);
    
    suppliers.push({
      id: index + 1,
      name: supplier.name,
      supplierType: supplier.type,
      contactPerson: supplier.contact,
      phone: supplier.phone,
      email: supplier.email,
      gstin: `27ABC${String(index + 1).padStart(2, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}F1Z${index + 1}`,
      panNumber: `ABC${String(index + 1).padStart(2, '0')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}${String.fromCharCode(65 + index)}`,
      billingAddress: `${Math.floor(Math.random() * 999) + 1} ${supplier.type} Street, Mumbai, Maharashtra 400001`,
      shippingAddress: `${Math.floor(Math.random() * 999) + 1} ${supplier.type} Street, Mumbai, Maharashtra 400001`,
      paymentTerms: paymentTerms[Math.floor(Math.random() * paymentTerms.length)],
      deliveryTime: deliveryTime,
      bankAccount: {
        accountNumber: `${Math.floor(Math.random() * 900000000) + 100000000}`,
        ifscCode: `HDFC000${String(index + 1).padStart(3, '0')}`,
        bankName: 'HDFC Bank',
        accountHolder: supplier.name
      },
      rating: parseFloat(rating),
      notes: Math.random() > 0.5 ? 'Reliable supplier with good quality products' : '',
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      registrationDate: subDays(new Date(), Math.floor(Math.random() * 365)),
      lastOrderDate: subDays(new Date(), Math.floor(Math.random() * 30)),
      totalPurchases: totalPurchases,
      totalOrders: Math.floor(totalPurchases / 10000),
      outstandingAmount: outstandingAmount,
      onTimeDeliveryRate: Math.floor(Math.random() * 30) + 70, // 70-100%
      returnRate: Math.floor(Math.random() * 10), // 0-10%
      averageDeliveryTime: deliveryTime + Math.floor(Math.random() * 3)
    });
  });

  return suppliers;
};

const generateMockPurchaseOrders = (suppliers) => {
  const purchaseOrders = [];
  const statuses = ['Draft', 'Sent', 'Delivered', 'Partially Received', 'Cancelled'];
  const medicines = [
    { name: 'Paracetamol 500mg', costPrice: 45.50 },
    { name: 'Amoxicillin 250mg', costPrice: 85.00 },
    { name: 'Ibuprofen 400mg', costPrice: 32.00 },
    { name: 'Cough Syrup 100ml', costPrice: 95.00 },
    { name: 'Vitamin D3 Tablets', costPrice: 120.00 },
    { name: 'Insulin Pen', costPrice: 450.00 },
    { name: 'Blood Pressure Monitor', costPrice: 1200.00 }
  ];

  for (let i = 0; i < 50; i++) {
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const orderDate = subDays(new Date(), Math.floor(Math.random() * 90));
    const expectedDelivery = addDays(orderDate, supplier.deliveryTime);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const orderItems = [];
    const itemCount = Math.floor(Math.random() * 5) + 1;
    
    for (let j = 0; j < itemCount; j++) {
      const medicine = medicines[Math.floor(Math.random() * medicines.length)];
      const quantity = Math.floor(Math.random() * 100) + 10;
      orderItems.push({
        id: j + 1,
        productName: medicine.name,
        quantity: quantity,
        costPrice: medicine.costPrice,
        totalAmount: quantity * medicine.costPrice
      });
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.totalAmount, 0);

    purchaseOrders.push({
      id: `PO${String(i + 1).padStart(4, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      orderDate: orderDate,
      expectedDeliveryDate: expectedDelivery,
      actualDeliveryDate: status === 'Delivered' ? addDays(expectedDelivery, Math.floor(Math.random() * 5) - 2) : null,
      status: status,
      items: orderItems,
      totalAmount: totalAmount,
      receivedAmount: status === 'Delivered' ? totalAmount : status === 'Partially Received' ? totalAmount * 0.7 : 0,
      notes: Math.random() > 0.7 ? 'Urgent order - expedite delivery' : '',
      createdBy: 'Purchase Manager',
      lastModified: orderDate
    });
  }

  return purchaseOrders.sort((a, b) => b.orderDate - a.orderDate);
};

const generateMockPayments = (suppliers, purchaseOrders) => {
  const payments = [];
  const paymentModes = ['Cash', 'Bank Transfer', 'Cheque', 'UPI'];

  purchaseOrders.forEach((po, index) => {
    if (po.status === 'Delivered' && Math.random() > 0.3) {
      const paymentDate = addDays(po.actualDeliveryDate, Math.floor(Math.random() * 30));
      const paymentAmount = po.receivedAmount * (0.8 + Math.random() * 0.2); // 80-100% of received amount
      
      payments.push({
        id: `PAY${String(index + 1).padStart(4, '0')}`,
        supplierId: po.supplierId,
        supplierName: po.supplierName,
        purchaseOrderId: po.id,
        amount: paymentAmount,
        paymentDate: paymentDate,
        paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
        referenceNumber: `REF${Math.floor(Math.random() * 1000000)}`,
        notes: Math.random() > 0.8 ? 'Partial payment - balance pending' : 'Full payment completed'
      });
    }
  });

  return payments.sort((a, b) => b.paymentDate - a.paymentDate);
};

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [grns, setGrns] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    supplierType: '',
    status: '',
    rating: '',
    paymentTerms: ''
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockSuppliers = generateMockSuppliers();
      const mockPurchaseOrders = generateMockPurchaseOrders(mockSuppliers);
      const mockPayments = generateMockPayments(mockSuppliers, mockPurchaseOrders);
      
      setSuppliers(mockSuppliers);
      setPurchaseOrders(mockPurchaseOrders);
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);
  }, []);

  // Search and filter suppliers
  const getFilteredSuppliers = () => {
    return suppliers.filter(supplier => {
      const matchesSearch = !searchTerm || 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone.includes(searchTerm) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !filters.supplierType || supplier.supplierType === filters.supplierType;
      const matchesStatus = !filters.status || supplier.status === filters.status;
      const matchesRating = !filters.rating || (() => {
        switch (filters.rating) {
          case 'excellent': return supplier.rating >= 4.5;
          case 'good': return supplier.rating >= 3.5 && supplier.rating < 4.5;
          case 'average': return supplier.rating < 3.5;
          default: return true;
        }
      })();
      const matchesPaymentTerms = !filters.paymentTerms || supplier.paymentTerms === filters.paymentTerms;

      return matchesSearch && matchesType && matchesStatus && matchesRating && matchesPaymentTerms;
    });
  };

  // Get supplier by ID
  const getSupplierById = (id) => {
    return suppliers.find(supplier => supplier.id === id);
  };

  // Add new supplier
  const addSupplier = (supplierData) => {
    const newSupplier = {
      ...supplierData,
      id: suppliers.length + 1,
      registrationDate: new Date(),
      totalPurchases: 0,
      totalOrders: 0,
      outstandingAmount: 0,
      onTimeDeliveryRate: 100,
      returnRate: 0,
      averageDeliveryTime: supplierData.deliveryTime,
      status: 'active'
    };
    
    setSuppliers(prev => [newSupplier, ...prev]);
    return newSupplier;
  };

  // Update supplier
  const updateSupplier = (supplierId, updates) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId 
        ? { ...supplier, ...updates }
        : supplier
    ));
  };

  // Add purchase order
  const addPurchaseOrder = (poData) => {
    const newPO = {
      ...poData,
      id: `PO${String(purchaseOrders.length + 1).padStart(4, '0')}`,
      orderDate: new Date(),
      status: 'Draft',
      receivedAmount: 0,
      createdBy: 'Current User',
      lastModified: new Date()
    };
    
    setPurchaseOrders(prev => [newPO, ...prev]);
    return newPO;
  };

  // Update purchase order
  const updatePurchaseOrder = (poId, updates) => {
    setPurchaseOrders(prev => prev.map(po => 
      po.id === poId 
        ? { ...po, ...updates, lastModified: new Date() }
        : po
    ));
  };

  // Add payment
  const addPayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: `PAY${String(payments.length + 1).padStart(4, '0')}`,
      paymentDate: new Date()
    };
    
    setPayments(prev => [newPayment, ...prev]);
    return newPayment;
  };

  // Get supplier analytics
  const getSupplierAnalytics = () => {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
    const totalPurchaseValue = suppliers.reduce((sum, s) => sum + s.totalPurchases, 0);
    const totalOutstanding = suppliers.reduce((sum, s) => sum + s.outstandingAmount, 0);
    const averageRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / totalSuppliers;
    const onTimeDeliveryRate = suppliers.reduce((sum, s) => sum + s.onTimeDeliveryRate, 0) / totalSuppliers;

    return {
      totalSuppliers,
      activeSuppliers,
      totalPurchaseValue,
      totalOutstanding,
      averageRating: averageRating.toFixed(1),
      onTimeDeliveryRate: Math.round(onTimeDeliveryRate),
      pendingOrders: purchaseOrders.filter(po => po.status === 'Sent').length,
      overduePayments: payments.filter(p => differenceInDays(new Date(), p.paymentDate) > 30).length
    };
  };

  const value = {
    suppliers,
    purchaseOrders,
    payments,
    grns,
    returns,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    getFilteredSuppliers,
    getSupplierById,
    addSupplier,
    updateSupplier,
    addPurchaseOrder,
    updatePurchaseOrder,
    addPayment,
    getSupplierAnalytics
  };

  return (
    <SupplierContext.Provider value={value}>
      {children}
    </SupplierContext.Provider>
  );
};
