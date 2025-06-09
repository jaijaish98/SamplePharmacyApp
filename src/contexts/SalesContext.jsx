import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns';

const SalesContext = createContext();

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};

// Mock data generator
const generateMockSalesData = () => {
  const medicines = [
    { id: 1, name: 'Paracetamol 500mg', category: 'OTC', hsn: '30049099', gst: 12 },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Prescription', hsn: '30041000', gst: 12 },
    { id: 3, name: 'Crocin Advance', category: 'OTC', hsn: '30049099', gst: 12 },
    { id: 4, name: 'Dolo 650', category: 'OTC', hsn: '30049099', gst: 12 },
    { id: 5, name: 'Azithromycin 500mg', category: 'Prescription', hsn: '30041000', gst: 12 },
    { id: 6, name: 'Vitamin D3', category: 'Supplements', hsn: '30049099', gst: 5 },
    { id: 7, name: 'Blood Pressure Monitor', category: 'Devices', hsn: '90189099', gst: 18 },
    { id: 8, name: 'Thermometer Digital', category: 'Devices', hsn: '90251100', gst: 18 },
  ];

  const customers = [
    { id: 1, name: 'Rajesh Kumar', phone: '9876543210' },
    { id: 2, name: 'Priya Sharma', phone: '9876543211' },
    { id: 3, name: 'Amit Patel', phone: '9876543212' },
    { id: 4, name: 'Sunita Devi', phone: '9876543213' },
    { id: 5, name: 'Walk-in Customer', phone: '' },
  ];

  const paymentMethods = ['Cash', 'UPI', 'Card', 'Credit'];
  const cashiers = ['Dr. Sathya', 'Pharmacist A', 'Pharmacist B'];

  const sales = [];
  const today = new Date();
  
  // Generate sales for last 90 days
  for (let i = 0; i < 90; i++) {
    const date = subDays(today, i);
    const salesPerDay = Math.floor(Math.random() * 20) + 10; // 10-30 sales per day
    
    for (let j = 0; j < salesPerDay; j++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const medicine = medicines[Math.floor(Math.random() * medicines.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const unitPrice = Math.floor(Math.random() * 500) + 50;
      const subtotal = quantity * unitPrice;
      const discount = Math.floor(Math.random() * 50);
      const gstAmount = ((subtotal - discount) * medicine.gst) / 100;
      const total = subtotal - discount + gstAmount;
      
      const saleTime = new Date(date);
      saleTime.setHours(Math.floor(Math.random() * 12) + 8); // 8 AM to 8 PM
      saleTime.setMinutes(Math.floor(Math.random() * 60));
      
      sales.push({
        id: `INV${String(sales.length + 1).padStart(6, '0')}`,
        invoiceNo: `INV${String(sales.length + 1).padStart(6, '0')}`,
        date: saleTime,
        customer: customer,
        items: [{
          medicine: medicine,
          quantity: quantity,
          unitPrice: unitPrice,
          subtotal: subtotal
        }],
        subtotal: subtotal,
        discount: discount,
        gstAmount: gstAmount,
        total: total,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        cashier: cashiers[Math.floor(Math.random() * cashiers.length)],
        status: Math.random() > 0.05 ? 'completed' : 'returned' // 5% returns
      });
    }
  }
  
  return sales.sort((a, b) => b.date - a.date);
};

export const SalesProvider = ({ children }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date())
    },
    customer: '',
    medicine: '',
    paymentMethod: '',
    cashier: '',
    includeReturns: true
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSalesData(generateMockSalesData());
      setLoading(false);
    }, 1000);
  }, []);

  // Filter sales data based on current filters
  const getFilteredSales = () => {
    return salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      const isInDateRange = saleDate >= filters.dateRange.start && saleDate <= filters.dateRange.end;
      const matchesCustomer = !filters.customer || sale.customer.name.toLowerCase().includes(filters.customer.toLowerCase());
      const matchesMedicine = !filters.medicine || sale.items.some(item => 
        item.medicine.name.toLowerCase().includes(filters.medicine.toLowerCase())
      );
      const matchesPayment = !filters.paymentMethod || sale.paymentMethod === filters.paymentMethod;
      const matchesCashier = !filters.cashier || sale.cashier === filters.cashier;
      const includeReturns = filters.includeReturns || sale.status !== 'returned';
      
      return isInDateRange && matchesCustomer && matchesMedicine && matchesPayment && matchesCashier && includeReturns;
    });
  };

  // Calculate dashboard metrics
  const getDashboardMetrics = () => {
    const filteredSales = getFilteredSales();
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    
    const todaySales = filteredSales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= todayStart && saleDate <= todayEnd && sale.status === 'completed';
    });
    
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const totalInvoices = todaySales.length;
    
    // Payment method breakdown
    const paymentBreakdown = {};
    todaySales.forEach(sale => {
      paymentBreakdown[sale.paymentMethod] = (paymentBreakdown[sale.paymentMethod] || 0) + sale.total;
    });
    
    // Top selling medicines
    const medicineStats = {};
    todaySales.forEach(sale => {
      sale.items.forEach(item => {
        const medName = item.medicine.name;
        if (!medicineStats[medName]) {
          medicineStats[medName] = { quantity: 0, revenue: 0 };
        }
        medicineStats[medName].quantity += item.quantity;
        medicineStats[medName].revenue += item.subtotal;
      });
    });
    
    const topMedicines = Object.entries(medicineStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return {
      todayRevenue,
      totalInvoices,
      paymentBreakdown,
      topMedicines,
      totalSales: filteredSales.filter(sale => sale.status === 'completed').length,
      totalReturns: filteredSales.filter(sale => sale.status === 'returned').length
    };
  };

  // Get monthly sales data for charts
  const getMonthlySalesData = () => {
    const monthlyData = {};
    const filteredSales = getFilteredSales().filter(sale => sale.status === 'completed');
    
    filteredSales.forEach(sale => {
      const monthKey = format(new Date(sale.date), 'yyyy-MM');
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, count: 0 };
      }
      monthlyData[monthKey].revenue += sale.total;
      monthlyData[monthKey].count += 1;
    });
    
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        count: data.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  // Get revenue by category
  const getRevenueByCategory = () => {
    const categoryData = {};
    const filteredSales = getFilteredSales().filter(sale => sale.status === 'completed');
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const category = item.medicine.category;
        categoryData[category] = (categoryData[category] || 0) + item.subtotal;
      });
    });
    
    return Object.entries(categoryData).map(([category, revenue]) => ({
      category,
      revenue
    }));
  };

  const value = {
    salesData,
    loading,
    filters,
    setFilters,
    getFilteredSales,
    getDashboardMetrics,
    getMonthlySalesData,
    getRevenueByCategory
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};
