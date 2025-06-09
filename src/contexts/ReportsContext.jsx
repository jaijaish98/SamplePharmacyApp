import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, subDays, subMonths, addDays } from 'date-fns';

const ReportsContext = createContext();

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

// Mock data generators for different report types
const generateMockInventoryData = () => {
  const medicines = [
    { id: 1, name: 'Paracetamol 500mg', category: 'OTC', brand: 'Crocin', hsn: '30049099' },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Prescription', brand: 'Novamox', hsn: '30041000' },
    { id: 3, name: 'Vitamin D3', category: 'Supplements', brand: 'Calcirol', hsn: '30049099' },
    { id: 4, name: 'Blood Pressure Monitor', category: 'Devices', brand: 'Omron', hsn: '90189099' },
    { id: 5, name: 'Azithromycin 500mg', category: 'Prescription', brand: 'Azee', hsn: '30041000' },
    { id: 6, name: 'Cetirizine 10mg', category: 'OTC', brand: 'Zyrtec', hsn: '30049099' },
    { id: 7, name: 'Insulin Pen', category: 'Prescription', brand: 'Lantus', hsn: '30041000' },
    { id: 8, name: 'Thermometer Digital', category: 'Devices', brand: 'Dr. Morepen', hsn: '90251100' },
  ];

  const suppliers = ['MedPlus Distributors', 'Apollo Pharmacy', 'Cipla Ltd', 'Sun Pharma', 'Dr. Reddy\'s'];
  const locations = ['Shelf A1', 'Shelf A2', 'Shelf B1', 'Shelf B2', 'Cold Storage', 'Counter Display'];

  const inventory = [];
  const today = new Date();

  medicines.forEach((medicine, index) => {
    // Generate multiple batches for each medicine
    const batchCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < batchCount; i++) {
      const batchNo = `B${String(index + 1).padStart(3, '0')}${String(i + 1).padStart(2, '0')}`;
      const expiryDate = addDays(today, Math.floor(Math.random() * 730) + 30); // 30 days to 2 years
      const costPrice = Math.floor(Math.random() * 200) + 20;
      const mrp = Math.floor(costPrice * (1.2 + Math.random() * 0.8)); // 20-100% markup
      const quantity = Math.floor(Math.random() * 500) + 10;
      const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      inventory.push({
        id: `${medicine.id}-${i}`,
        medicine: medicine,
        batchNo: batchNo,
        expiryDate: expiryDate,
        costPrice: costPrice,
        mrp: mrp,
        quantity: quantity,
        supplier: supplier,
        location: location,
        purchaseDate: subDays(today, Math.floor(Math.random() * 180)),
        status: quantity > 10 ? 'in-stock' : quantity > 0 ? 'low-stock' : 'out-of-stock'
      });
    }
  });

  return inventory;
};

const generateMockPurchaseData = () => {
  const suppliers = ['MedPlus Distributors', 'Apollo Pharmacy', 'Cipla Ltd', 'Sun Pharma', 'Dr. Reddy\'s'];
  const medicines = [
    'Paracetamol 500mg', 'Amoxicillin 250mg', 'Vitamin D3', 'Cetirizine 10mg', 
    'Azithromycin 500mg', 'Insulin Pen', 'Blood Pressure Monitor'
  ];
  
  const purchases = [];
  const today = new Date();

  for (let i = 0; i < 50; i++) {
    const purchaseDate = subDays(today, Math.floor(Math.random() * 90));
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const medicine = medicines[Math.floor(Math.random() * medicines.length)];
    const quantity = Math.floor(Math.random() * 100) + 10;
    const unitCost = Math.floor(Math.random() * 150) + 25;
    const totalCost = quantity * unitCost;
    const paymentStatus = Math.random() > 0.2 ? 'paid' : 'pending';

    purchases.push({
      id: `PO${String(i + 1).padStart(6, '0')}`,
      invoiceNo: `PI${String(i + 1).padStart(6, '0')}`,
      date: purchaseDate,
      supplier: supplier,
      medicine: medicine,
      quantity: quantity,
      unitCost: unitCost,
      totalCost: totalCost,
      paymentStatus: paymentStatus,
      receivedDate: Math.random() > 0.1 ? purchaseDate : null,
      status: Math.random() > 0.1 ? 'received' : 'pending'
    });
  }

  return purchases.sort((a, b) => b.date - a.date);
};

const generateMockCustomerData = () => {
  const customers = [
    { id: 1, name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@email.com' },
    { id: 2, name: 'Priya Sharma', phone: '9876543211', email: 'priya@email.com' },
    { id: 3, name: 'Amit Patel', phone: '9876543212', email: 'amit@email.com' },
    { id: 4, name: 'Sunita Devi', phone: '9876543213', email: 'sunita@email.com' },
    { id: 5, name: 'Ravi Gupta', phone: '9876543214', email: 'ravi@email.com' },
    { id: 6, name: 'Meera Singh', phone: '9876543215', email: 'meera@email.com' },
  ];

  const customerPurchases = [];
  const today = new Date();

  customers.forEach(customer => {
    const purchaseCount = Math.floor(Math.random() * 15) + 5; // 5-20 purchases per customer
    
    for (let i = 0; i < purchaseCount; i++) {
      const purchaseDate = subDays(today, Math.floor(Math.random() * 180));
      const amount = Math.floor(Math.random() * 2000) + 100;
      const discount = Math.floor(Math.random() * 100);
      
      customerPurchases.push({
        id: `CP${customer.id}${String(i + 1).padStart(3, '0')}`,
        customer: customer,
        date: purchaseDate,
        amount: amount,
        discount: discount,
        netAmount: amount - discount,
        items: Math.floor(Math.random() * 5) + 1,
        paymentMethod: ['Cash', 'UPI', 'Card'][Math.floor(Math.random() * 3)]
      });
    }
  });

  return customerPurchases.sort((a, b) => b.date - a.date);
};

export const ReportsProvider = ({ children }) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date())
    },
    reportType: 'sales',
    category: '',
    supplier: '',
    customer: '',
    status: ''
  });

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setInventoryData(generateMockInventoryData());
      setPurchaseData(generateMockPurchaseData());
      setCustomerData(generateMockCustomerData());
      setLoading(false);
    }, 1000);
  }, []);

  // Get inventory reports
  const getInventoryReports = () => {
    const currentStock = inventoryData.reduce((acc, item) => {
      const existing = acc.find(i => i.medicine.id === item.medicine.id);
      if (existing) {
        existing.totalQuantity += item.quantity;
        existing.totalValue += item.quantity * item.costPrice;
        existing.batches.push(item);
      } else {
        acc.push({
          medicine: item.medicine,
          totalQuantity: item.quantity,
          totalValue: item.quantity * item.costPrice,
          batches: [item],
          status: item.status
        });
      }
      return acc;
    }, []);

    return currentStock;
  };

  // Get expiry reports
  const getExpiryReports = (days = 30) => {
    const today = new Date();
    const expiryThreshold = addDays(today, days);
    
    const nearExpiry = inventoryData.filter(item => 
      item.expiryDate <= expiryThreshold && item.expiryDate > today && item.quantity > 0
    );
    
    const expired = inventoryData.filter(item => 
      item.expiryDate <= today && item.quantity > 0
    );

    return { nearExpiry, expired };
  };

  // Get purchase reports
  const getPurchaseReports = () => {
    const filteredPurchases = purchaseData.filter(purchase => {
      const purchaseDate = new Date(purchase.date);
      return purchaseDate >= filters.dateRange.start && purchaseDate <= filters.dateRange.end;
    });

    const supplierSummary = {};
    filteredPurchases.forEach(purchase => {
      if (!supplierSummary[purchase.supplier]) {
        supplierSummary[purchase.supplier] = {
          totalOrders: 0,
          totalAmount: 0,
          pendingAmount: 0
        };
      }
      supplierSummary[purchase.supplier].totalOrders += 1;
      supplierSummary[purchase.supplier].totalAmount += purchase.totalCost;
      if (purchase.paymentStatus === 'pending') {
        supplierSummary[purchase.supplier].pendingAmount += purchase.totalCost;
      }
    });

    return { purchases: filteredPurchases, supplierSummary };
  };

  // Get customer reports
  const getCustomerReports = () => {
    const filteredCustomers = customerData.filter(purchase => {
      const purchaseDate = new Date(purchase.date);
      return purchaseDate >= filters.dateRange.start && purchaseDate <= filters.dateRange.end;
    });

    const customerSummary = {};
    filteredCustomers.forEach(purchase => {
      const customerId = purchase.customer.id;
      if (!customerSummary[customerId]) {
        customerSummary[customerId] = {
          customer: purchase.customer,
          totalPurchases: 0,
          totalAmount: 0,
          totalDiscount: 0,
          lastPurchase: purchase.date,
          avgOrderValue: 0
        };
      }
      customerSummary[customerId].totalPurchases += 1;
      customerSummary[customerId].totalAmount += purchase.netAmount;
      customerSummary[customerId].totalDiscount += purchase.discount;
      if (purchase.date > customerSummary[customerId].lastPurchase) {
        customerSummary[customerId].lastPurchase = purchase.date;
      }
    });

    // Calculate average order value
    Object.values(customerSummary).forEach(customer => {
      customer.avgOrderValue = customer.totalAmount / customer.totalPurchases;
    });

    return Object.values(customerSummary).sort((a, b) => b.totalAmount - a.totalAmount);
  };

  // Get profitability reports
  const getProfitabilityReports = () => {
    // This would integrate with sales data to calculate profit margins
    // For now, using mock calculations
    const profitByProduct = inventoryData.map(item => {
      const avgSellingPrice = item.mrp * 0.95; // Assume 5% discount on average
      const profit = avgSellingPrice - item.costPrice;
      const margin = (profit / avgSellingPrice) * 100;
      
      return {
        medicine: item.medicine,
        costPrice: item.costPrice,
        sellingPrice: avgSellingPrice,
        profit: profit,
        margin: margin,
        quantity: item.quantity
      };
    }).sort((a, b) => b.margin - a.margin);

    return profitByProduct;
  };

  const value = {
    inventoryData,
    purchaseData,
    customerData,
    loading,
    filters,
    setFilters,
    getInventoryReports,
    getExpiryReports,
    getPurchaseReports,
    getCustomerReports,
    getProfitabilityReports
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};
