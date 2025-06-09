import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, subDays, subMonths, addDays } from 'date-fns';

const CustomerContext = createContext();

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};

// Alias for billing system compatibility
export const useCustomer = useCustomers;

// Mock data generators
const generateMockCustomers = () => {
  const customers = [];
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Devi', 'Ravi Gupta',
    'Meera Singh', 'Vikram Reddy', 'Kavita Joshi', 'Suresh Nair', 'Anita Verma',
    'Deepak Shah', 'Pooja Agarwal', 'Manoj Tiwari', 'Rekha Iyer', 'Ashok Yadav',
    'Neha Kapoor', 'Sanjay Mishra', 'Geeta Rao', 'Ramesh Pandey', 'Shanti Devi'
  ];
  
  const conditions = ['Diabetes', 'Hypertension', 'Asthma', 'Arthritis', 'Heart Disease', 'Thyroid'];
  const allergies = ['Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Latex'];
  const tags = ['Regular Customer', 'VIP', 'Elderly', 'Diabetic', 'Frequent Buyer', 'B2B Customer'];

  for (let i = 0; i < 50; i++) {
    const name = names[i % names.length] + (i > 19 ? ` ${Math.floor(i/20)}` : '');
    const age = Math.floor(Math.random() * 60) + 20;
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const phone = `98765${String(43210 + i).padStart(5, '0')}`;
    const email = Math.random() > 0.3 ? `${name.toLowerCase().replace(' ', '.')}@email.com` : '';
    
    const customer = {
      id: i + 1,
      customerCode: `CUST${String(i + 1).padStart(4, '0')}`,
      name: name,
      age: age,
      dateOfBirth: subDays(new Date(), age * 365 + Math.floor(Math.random() * 365)),
      gender: gender,
      phone: phone,
      email: email,
      address: `${Math.floor(Math.random() * 999) + 1}, ${['MG Road', 'Park Street', 'Main Street', 'Gandhi Nagar', 'Nehru Place'][Math.floor(Math.random() * 5)]}, City - ${Math.floor(Math.random() * 899999) + 100000}`,
      gstin: Math.random() > 0.8 ? `29ABCDE${String(1234 + i).padStart(4, '0')}F1Z5` : '',
      emergencyContact: Math.random() > 0.4 ? `98765${String(54321 + i).padStart(5, '0')}` : '',
      allergies: Math.random() > 0.7 ? [allergies[Math.floor(Math.random() * allergies.length)]] : [],
      chronicConditions: Math.random() > 0.6 ? [conditions[Math.floor(Math.random() * conditions.length)]] : [],
      notes: Math.random() > 0.5 ? ['Frequent buyer', 'Elderly patient', 'Prefers generic medicines', 'Cash payments only'][Math.floor(Math.random() * 4)] : '',
      tags: Math.random() > 0.4 ? [tags[Math.floor(Math.random() * tags.length)]] : [],
      loyaltyPoints: Math.floor(Math.random() * 5000),
      totalPurchases: Math.floor(Math.random() * 50) + 1,
      totalSpent: Math.floor(Math.random() * 50000) + 1000,
      lastVisit: subDays(new Date(), Math.floor(Math.random() * 180)),
      registrationDate: subDays(new Date(), Math.floor(Math.random() * 730) + 30),
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      mobileVerified: Math.random() > 0.2,
      emailVerified: email ? Math.random() > 0.3 : false,
      preferredPaymentMethod: ['Cash', 'UPI', 'Card', 'Credit'][Math.floor(Math.random() * 4)],
      discountEligible: Math.random() > 0.7,
      birthdayOffers: Math.random() > 0.5
    };
    
    customers.push(customer);
  }
  
  return customers.sort((a, b) => b.lastVisit - a.lastVisit);
};

const generateMockPurchaseHistory = (customerId) => {
  const purchases = [];
  const medicines = [
    'Paracetamol 500mg', 'Amoxicillin 250mg', 'Cetirizine 10mg', 'Vitamin D3',
    'Azithromycin 500mg', 'Insulin Pen', 'Blood Pressure Monitor', 'Thermometer'
  ];
  
  const purchaseCount = Math.floor(Math.random() * 20) + 5;
  
  for (let i = 0; i < purchaseCount; i++) {
    const date = subDays(new Date(), Math.floor(Math.random() * 365));
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items = [];
    let total = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const medicine = medicines[Math.floor(Math.random() * medicines.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = Math.floor(Math.random() * 200) + 50;
      const subtotal = quantity * price;
      
      items.push({
        medicine: medicine,
        quantity: quantity,
        price: price,
        subtotal: subtotal
      });
      
      total += subtotal;
    }
    
    const discount = Math.floor(Math.random() * total * 0.1);
    
    purchases.push({
      id: `INV${customerId}${String(i + 1).padStart(3, '0')}`,
      invoiceNo: `INV${String(Date.now() + i).slice(-6)}`,
      date: date,
      items: items,
      subtotal: total,
      discount: discount,
      total: total - discount,
      paymentMethod: ['Cash', 'UPI', 'Card', 'Credit'][Math.floor(Math.random() * 4)],
      prescriptionLinked: Math.random() > 0.7,
      loyaltyPointsEarned: Math.floor((total - discount) * 0.01)
    });
  }
  
  return purchases.sort((a, b) => b.date - a.date);
};

const generateMockPrescriptions = (customerId) => {
  const prescriptions = [];
  const doctors = ['Dr. Sharma', 'Dr. Patel', 'Dr. Singh', 'Dr. Reddy', 'Dr. Gupta'];
  const prescriptionCount = Math.floor(Math.random() * 8) + 2;
  
  for (let i = 0; i < prescriptionCount; i++) {
    const date = subDays(new Date(), Math.floor(Math.random() * 365));
    const validityDays = [30, 60, 90][Math.floor(Math.random() * 3)];
    
    prescriptions.push({
      id: `RX${customerId}${String(i + 1).padStart(3, '0')}`,
      uploadDate: date,
      doctorName: doctors[Math.floor(Math.random() * doctors.length)],
      validityDays: validityDays,
      expiryDate: addDays(date, validityDays),
      status: addDays(date, validityDays) > new Date() ? 'valid' : 'expired',
      fileName: `prescription_${customerId}_${i + 1}.pdf`,
      fileSize: Math.floor(Math.random() * 2000) + 500, // KB
      medicines: [
        'Paracetamol 500mg - 2 times daily',
        'Amoxicillin 250mg - 3 times daily',
        'Vitamin D3 - Once daily'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      notes: Math.random() > 0.5 ? 'Take after meals' : '',
      reminderSent: Math.random() > 0.6
    });
  }
  
  return prescriptions.sort((a, b) => b.uploadDate - a.uploadDate);
};

const generateMockFeedback = (customerId) => {
  const feedback = [];
  const types = ['complaint', 'suggestion', 'compliment', 'query'];
  const feedbackCount = Math.floor(Math.random() * 5);
  
  for (let i = 0; i < feedbackCount; i++) {
    const date = subDays(new Date(), Math.floor(Math.random() * 180));
    const type = types[Math.floor(Math.random() * types.length)];
    
    feedback.push({
      id: `FB${customerId}${String(i + 1).padStart(3, '0')}`,
      date: date,
      type: type,
      subject: {
        complaint: 'Medicine quality issue',
        suggestion: 'Improve waiting time',
        compliment: 'Excellent service',
        query: 'Medicine availability'
      }[type],
      description: `Sample ${type} description for customer feedback`,
      status: Math.random() > 0.3 ? 'resolved' : 'pending',
      assignedTo: Math.random() > 0.5 ? 'Dr. Sathya' : 'Store Manager',
      resolution: Math.random() > 0.3 ? 'Issue resolved satisfactorily' : '',
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
    });
  }
  
  return feedback.sort((a, b) => b.date - a.date);
};

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    gender: '',
    ageGroup: '',
    tags: '',
    loyaltyTier: '',
    lastVisit: ''
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomers(generateMockCustomers());
      setLoading(false);
    }, 1000);
  }, []);

  // Search and filter customers
  const getFilteredCustomers = () => {
    return customers.filter(customer => {
      const matchesSearch = !searchTerm || 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status || customer.status === filters.status;
      const matchesGender = !filters.gender || customer.gender === filters.gender;
      
      const matchesAgeGroup = !filters.ageGroup || (() => {
        switch (filters.ageGroup) {
          case 'young': return customer.age < 30;
          case 'middle': return customer.age >= 30 && customer.age < 60;
          case 'senior': return customer.age >= 60;
          default: return true;
        }
      })();

      const matchesTags = !filters.tags || customer.tags.includes(filters.tags);
      
      const matchesLoyaltyTier = !filters.loyaltyTier || (() => {
        switch (filters.loyaltyTier) {
          case 'bronze': return customer.loyaltyPoints < 1000;
          case 'silver': return customer.loyaltyPoints >= 1000 && customer.loyaltyPoints < 3000;
          case 'gold': return customer.loyaltyPoints >= 3000;
          default: return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesGender && matchesAgeGroup && matchesTags && matchesLoyaltyTier;
    });
  };

  // Get customer by ID
  const getCustomerById = (id) => {
    return customers.find(customer => customer.id === id);
  };

  // Get customer purchase history
  const getCustomerPurchaseHistory = (customerId) => {
    return generateMockPurchaseHistory(customerId);
  };

  // Get customer prescriptions
  const getCustomerPrescriptions = (customerId) => {
    return generateMockPrescriptions(customerId);
  };

  // Get customer feedback
  const getCustomerFeedback = (customerId) => {
    return generateMockFeedback(customerId);
  };

  // Add new customer
  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: customers.length + 1,
      customerCode: `CUST${String(customers.length + 1).padStart(4, '0')}`,
      registrationDate: new Date(),
      loyaltyPoints: 0,
      totalPurchases: 0,
      totalSpent: 0,
      lastVisit: new Date(),
      status: 'active',
      tags: customerData.tags || [],
      allergies: customerData.allergies || [],
      chronicConditions: customerData.chronicConditions || []
    };
    
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  // Update customer
  const updateCustomer = (customerId, updates) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, ...updates } : customer
    ));
  };

  // Delete customer
  const deleteCustomer = (customerId) => {
    setCustomers(prev => prev.filter(customer => customer.id !== customerId));
  };

  // Get customer analytics
  const getCustomerAnalytics = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const newCustomersThisMonth = customers.filter(c => 
      c.registrationDate >= subMonths(new Date(), 1)
    ).length;
    const repeatCustomers = customers.filter(c => c.totalPurchases > 1).length;
    const avgLoyaltyPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0) / totalCustomers;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

    return {
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      repeatCustomers,
      avgLoyaltyPoints: Math.round(avgLoyaltyPoints),
      totalRevenue,
      retentionRate: Math.round((repeatCustomers / totalCustomers) * 100)
    };
  };

  const value = {
    customers,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    getFilteredCustomers,
    getCustomerById,
    getCustomerPurchaseHistory,
    getCustomerPrescriptions,
    getCustomerFeedback,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerAnalytics
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};
