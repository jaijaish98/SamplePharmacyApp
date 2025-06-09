import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, subDays, addDays, differenceInDays } from 'date-fns';

const StockContext = createContext();

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};

// Mock data generators
const generateMockStockItems = () => {
  const stockItems = [];
  const categories = ['Tablets', 'Capsules', 'Syrups', 'Injections', 'Ointments', 'Drops'];
  const brands = ['Cipla', 'Sun Pharma', 'Dr. Reddy\'s', 'Lupin', 'Aurobindo', 'Torrent'];
  const salts = ['Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Metformin', 'Atorvastatin', 'Omeprazole'];
  
  const medicines = [
    { name: 'Paracetamol 500mg', salt: 'Paracetamol', brand: 'Crocin', category: 'Tablets' },
    { name: 'Amoxicillin 250mg', salt: 'Amoxicillin', brand: 'Amoxil', category: 'Capsules' },
    { name: 'Ibuprofen 400mg', salt: 'Ibuprofen', brand: 'Brufen', category: 'Tablets' },
    { name: 'Cough Syrup 100ml', salt: 'Dextromethorphan', brand: 'Benadryl', category: 'Syrups' },
    { name: 'Vitamin D3 Tablets', salt: 'Cholecalciferol', brand: 'Calcirol', category: 'Tablets' },
    { name: 'Insulin Pen', salt: 'Insulin', brand: 'Lantus', category: 'Injections' },
    { name: 'Eye Drops 10ml', salt: 'Chloramphenicol', brand: 'Chloromycetin', category: 'Drops' },
    { name: 'Antacid Syrup', salt: 'Aluminium Hydroxide', brand: 'Gelusil', category: 'Syrups' },
    { name: 'Blood Pressure Monitor', salt: 'N/A', brand: 'Omron', category: 'Devices' },
    { name: 'Thermometer Digital', salt: 'N/A', brand: 'Dr. Morepen', category: 'Devices' }
  ];

  medicines.forEach((medicine, index) => {
    const currentStock = Math.floor(Math.random() * 500) + 10;
    const reorderLevel = Math.floor(Math.random() * 50) + 20;
    const maxStock = reorderLevel * 5;
    const costPrice = Math.floor(Math.random() * 200) + 20;
    const mrp = costPrice * (1.3 + Math.random() * 0.5); // 30-80% markup
    const expiryDate = addDays(new Date(), Math.floor(Math.random() * 730) + 30); // 30 days to 2 years
    const daysToExpiry = differenceInDays(expiryDate, new Date());
    
    stockItems.push({
      id: index + 1,
      name: medicine.name,
      salt: medicine.salt,
      brand: medicine.brand,
      category: medicine.category,
      batchNumber: `${medicine.brand.substring(0, 3).toUpperCase()}${String(index + 1).padStart(3, '0')}`,
      currentStock: currentStock,
      reorderLevel: reorderLevel,
      maxStock: maxStock,
      costPrice: costPrice,
      mrp: Math.round(mrp),
      sellingPrice: Math.round(mrp * 0.9), // 10% discount from MRP
      expiryDate: expiryDate,
      daysToExpiry: daysToExpiry,
      isLowStock: currentStock <= reorderLevel,
      isNearExpiry: daysToExpiry <= 30,
      isOutOfStock: currentStock === 0,
      supplier: brands[Math.floor(Math.random() * brands.length)],
      location: `Rack ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(Math.random() * 10) + 1}`,
      lastUpdated: subDays(new Date(), Math.floor(Math.random() * 7)),
      lastStockUpdate: subDays(new Date(), Math.floor(Math.random() * 30)),
      stockMovements: []
    });
  });

  return stockItems;
};

const generateMockStockMovements = (stockItems) => {
  const movements = [];
  const movementTypes = ['sale', 'purchase', 'adjustment', 'transfer', 'return'];
  const reasons = ['Sale', 'New Purchase', 'Damaged', 'Expired', 'Transfer Out', 'Transfer In', 'Return to Supplier', 'Customer Return'];
  
  stockItems.forEach(item => {
    const movementCount = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < movementCount; i++) {
      const type = movementTypes[Math.floor(Math.random() * movementTypes.length)];
      const quantity = Math.floor(Math.random() * 50) + 1;
      const isInward = ['purchase', 'transfer', 'return'].includes(type);
      
      movements.push({
        id: movements.length + 1,
        itemId: item.id,
        itemName: item.name,
        type: type,
        quantity: isInward ? quantity : -quantity,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        date: subDays(new Date(), Math.floor(Math.random() * 90)),
        user: 'Staff User',
        batchNumber: item.batchNumber,
        notes: Math.random() > 0.7 ? 'Automatic stock update' : '',
        balanceAfter: item.currentStock + (isInward ? quantity : -quantity)
      });
    }
  });

  return movements.sort((a, b) => b.date - a.date);
};

const generateMockBranches = () => {
  return [
    { id: 1, name: 'Main Branch', location: 'Mumbai Central', isMain: true },
    { id: 2, name: 'Branch 1', location: 'Andheri West', isMain: false },
    { id: 3, name: 'Branch 2', location: 'Bandra East', isMain: false },
    { id: 4, name: 'Branch 3', location: 'Thane', isMain: false }
  ];
};

export const StockProvider = ({ children }) => {
  const [stockItems, setStockItems] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    stockStatus: '',
    expiryStatus: ''
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockStockItems = generateMockStockItems();
      const mockMovements = generateMockStockMovements(mockStockItems);
      const mockBranches = generateMockBranches();
      
      setStockItems(mockStockItems);
      setStockMovements(mockMovements);
      setBranches(mockBranches);
      setLoading(false);
    }, 1000);
  }, []);

  // Search and filter stock items
  const getFilteredStockItems = () => {
    return stockItems.filter(item => {
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.salt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !filters.category || item.category === filters.category;
      const matchesBrand = !filters.brand || item.brand === filters.brand;
      
      const matchesStockStatus = !filters.stockStatus || (() => {
        switch (filters.stockStatus) {
          case 'in_stock': return item.currentStock > item.reorderLevel;
          case 'low_stock': return item.isLowStock && item.currentStock > 0;
          case 'out_of_stock': return item.isOutOfStock;
          default: return true;
        }
      })();

      const matchesExpiryStatus = !filters.expiryStatus || (() => {
        switch (filters.expiryStatus) {
          case 'near_expiry': return item.isNearExpiry;
          case 'expired': return item.daysToExpiry < 0;
          case 'valid': return item.daysToExpiry > 30;
          default: return true;
        }
      })();

      return matchesSearch && matchesCategory && matchesBrand && matchesStockStatus && matchesExpiryStatus;
    });
  };

  // Get stock item by ID
  const getStockItemById = (id) => {
    return stockItems.find(item => item.id === id);
  };

  // Update stock quantity
  const updateStock = (itemId, quantity, type, reason, notes = '') => {
    const item = getStockItemById(itemId);
    if (!item) return;

    const newQuantity = Math.max(0, item.currentStock + quantity);
    
    // Update stock item
    setStockItems(prev => prev.map(stockItem => 
      stockItem.id === itemId 
        ? { 
            ...stockItem, 
            currentStock: newQuantity,
            isLowStock: newQuantity <= stockItem.reorderLevel,
            isOutOfStock: newQuantity === 0,
            lastUpdated: new Date(),
            lastStockUpdate: new Date()
          }
        : stockItem
    ));

    // Add stock movement
    const movement = {
      id: stockMovements.length + 1,
      itemId: itemId,
      itemName: item.name,
      type: type,
      quantity: quantity,
      reason: reason,
      date: new Date(),
      user: 'Current User',
      batchNumber: item.batchNumber,
      notes: notes,
      balanceAfter: newQuantity
    };

    setStockMovements(prev => [movement, ...prev]);
    return movement;
  };

  // Manual stock adjustment
  const adjustStock = (itemId, newQuantity, reason, notes = '') => {
    const item = getStockItemById(itemId);
    if (!item) return;

    const difference = newQuantity - item.currentStock;
    return updateStock(itemId, difference, 'adjustment', reason, notes);
  };

  // Stock sale (deduction)
  const saleStock = (itemId, quantity, invoiceId = '') => {
    return updateStock(itemId, -quantity, 'sale', 'Sale', `Invoice: ${invoiceId}`);
  };

  // Stock purchase (addition)
  const purchaseStock = (itemId, quantity, poId = '') => {
    return updateStock(itemId, quantity, 'purchase', 'Purchase', `PO: ${poId}`);
  };

  // Update reorder level
  const updateReorderLevel = (itemId, newReorderLevel) => {
    setStockItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            reorderLevel: newReorderLevel,
            isLowStock: item.currentStock <= newReorderLevel,
            lastUpdated: new Date()
          }
        : item
    ));
  };

  // Get low stock items
  const getLowStockItems = () => {
    return stockItems.filter(item => item.isLowStock && !item.isOutOfStock);
  };

  // Get out of stock items
  const getOutOfStockItems = () => {
    return stockItems.filter(item => item.isOutOfStock);
  };

  // Get near expiry items
  const getNearExpiryItems = () => {
    return stockItems.filter(item => item.isNearExpiry);
  };

  // Get stock analytics
  const getStockAnalytics = () => {
    const totalItems = stockItems.length;
    const inStock = stockItems.filter(item => item.currentStock > item.reorderLevel).length;
    const lowStock = getLowStockItems().length;
    const outOfStock = getOutOfStockItems().length;
    const nearExpiry = getNearExpiryItems().length;
    const totalValue = stockItems.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);
    const totalMRP = stockItems.reduce((sum, item) => sum + (item.currentStock * item.mrp), 0);

    return {
      totalItems,
      inStock,
      lowStock,
      outOfStock,
      nearExpiry,
      totalValue,
      totalMRP,
      stockTurnover: 85, // Mock percentage
      averageStockDays: 45 // Mock days
    };
  };

  // Get stock movements for an item
  const getItemMovements = (itemId) => {
    return stockMovements.filter(movement => movement.itemId === itemId);
  };

  const value = {
    stockItems,
    stockMovements,
    branches,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    getFilteredStockItems,
    getStockItemById,
    updateStock,
    adjustStock,
    saleStock,
    purchaseStock,
    updateReorderLevel,
    getLowStockItems,
    getOutOfStockItems,
    getNearExpiryItems,
    getStockAnalytics,
    getItemMovements
  };

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
};
