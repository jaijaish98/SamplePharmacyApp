import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, subDays, addDays, differenceInDays } from 'date-fns';

const PrescriptionContext = createContext();

export const usePrescriptions = () => {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error('usePrescriptions must be used within a PrescriptionProvider');
  }
  return context;
};

// Mock data generators
const generateMockPrescriptions = () => {
  const prescriptions = [];
  const customers = [
    { id: 1, name: 'Rajesh Kumar', phone: '9876543210' },
    { id: 2, name: 'Priya Sharma', phone: '9876543211' },
    { id: 3, name: 'Amit Patel', phone: '9876543212' },
    { id: 4, name: 'Sunita Devi', phone: '9876543213' },
    { id: 5, name: 'Ravi Gupta', phone: '9876543214' }
  ];
  
  const doctors = [
    { name: 'Dr. Sharma', regNo: 'MH12345', specialization: 'General Medicine' },
    { name: 'Dr. Patel', regNo: 'MH12346', specialization: 'Cardiology' },
    { name: 'Dr. Singh', regNo: 'MH12347', specialization: 'Pediatrics' },
    { name: 'Dr. Reddy', regNo: 'MH12348', specialization: 'Orthopedics' },
    { name: 'Dr. Gupta', regNo: 'MH12349', specialization: 'Dermatology' }
  ];

  const medicines = [
    { name: 'Paracetamol 500mg', dosage: '1 tablet twice daily', scheduleType: 'OTC', inStock: true },
    { name: 'Amoxicillin 250mg', dosage: '1 capsule thrice daily', scheduleType: 'H', inStock: true },
    { name: 'Insulin Pen', dosage: 'As directed', scheduleType: 'H1', inStock: false },
    { name: 'Metformin 500mg', dosage: '1 tablet twice daily', scheduleType: 'H', inStock: true },
    { name: 'Atorvastatin 10mg', dosage: '1 tablet at bedtime', scheduleType: 'H', inStock: true },
    { name: 'Alprazolam 0.5mg', dosage: 'As needed', scheduleType: 'H1', inStock: true },
    { name: 'Morphine 10mg', dosage: 'As directed', scheduleType: 'X', inStock: false }
  ];

  for (let i = 0; i < 25; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const uploadDate = subDays(new Date(), Math.floor(Math.random() * 90));
    const validityDays = [30, 60, 90][Math.floor(Math.random() * 3)];
    const expiryDate = addDays(uploadDate, validityDays);
    const isExpired = expiryDate < new Date();
    const daysToExpiry = differenceInDays(expiryDate, new Date());
    
    // Generate medicines for this prescription
    const prescribedMedicines = [];
    const medicineCount = Math.floor(Math.random() * 4) + 1;
    for (let j = 0; j < medicineCount; j++) {
      const medicine = medicines[Math.floor(Math.random() * medicines.length)];
      prescribedMedicines.push({
        id: j + 1,
        name: medicine.name,
        dosage: medicine.dosage,
        quantity: Math.floor(Math.random() * 30) + 10,
        scheduleType: medicine.scheduleType,
        inStock: medicine.inStock,
        fulfilled: Math.random() > 0.3,
        fulfilledQuantity: Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 5 : 0,
        fulfilledDate: Math.random() > 0.3 ? subDays(new Date(), Math.floor(Math.random() * 30)) : null
      });
    }

    const hasRestrictedMeds = prescribedMedicines.some(med => ['H', 'H1', 'X'].includes(med.scheduleType));
    const allFulfilled = prescribedMedicines.every(med => med.fulfilled);
    const partiallyFulfilled = prescribedMedicines.some(med => med.fulfilled) && !allFulfilled;
    
    let fulfillmentStatus = 'pending';
    if (allFulfilled) fulfillmentStatus = 'fulfilled';
    else if (partiallyFulfilled) fulfillmentStatus = 'partial';

    let validationStatus = 'pending';
    if (Math.random() > 0.3) {
      validationStatus = Math.random() > 0.1 ? 'approved' : 'rejected';
    }

    const prescription = {
      id: `RX${String(i + 1).padStart(4, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      doctorName: doctor.name,
      doctorRegNo: doctor.regNo,
      doctorSpecialization: doctor.specialization,
      uploadDate: uploadDate,
      validityDays: validityDays,
      expiryDate: expiryDate,
      isExpired: isExpired,
      daysToExpiry: daysToExpiry,
      fileName: `prescription_${i + 1}.${Math.random() > 0.5 ? 'pdf' : 'jpg'}`,
      fileSize: Math.floor(Math.random() * 2000) + 500, // KB
      fileType: Math.random() > 0.5 ? 'application/pdf' : 'image/jpeg',
      notes: Math.random() > 0.5 ? 'Take after meals. Complete the course.' : '',
      medicines: prescribedMedicines,
      validationStatus: validationStatus,
      validatedBy: validationStatus !== 'pending' ? 'Dr. Sathya' : null,
      validationDate: validationStatus !== 'pending' ? subDays(new Date(), Math.floor(Math.random() * 5)) : null,
      validationNotes: validationStatus === 'rejected' ? 'Prescription illegible. Please resubmit.' : '',
      fulfillmentStatus: fulfillmentStatus,
      hasRestrictedMedicines: hasRestrictedMeds,
      linkedInvoices: allFulfilled || partiallyFulfilled ? [`INV${String(Math.floor(Math.random() * 1000) + 1).padStart(4, '0')}`] : [],
      createdBy: 'Staff User',
      lastModified: uploadDate,
      complianceFlags: hasRestrictedMeds ? ['SCHEDULE_H_REQUIRED'] : []
    };

    prescriptions.push(prescription);
  }

  return prescriptions.sort((a, b) => b.uploadDate - a.uploadDate);
};

export const PrescriptionProvider = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    validationStatus: '',
    fulfillmentStatus: '',
    expiryStatus: '',
    scheduleType: '',
    doctorName: '',
    dateRange: ''
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPrescriptions(generateMockPrescriptions());
      setLoading(false);
    }, 1000);
  }, []);

  // Search and filter prescriptions
  const getFilteredPrescriptions = () => {
    return prescriptions.filter(prescription => {
      const matchesSearch = !searchTerm || 
        prescription.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.customerPhone.includes(searchTerm) ||
        prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medicines.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesValidation = !filters.validationStatus || prescription.validationStatus === filters.validationStatus;
      const matchesFulfillment = !filters.fulfillmentStatus || prescription.fulfillmentStatus === filters.fulfillmentStatus;
      
      const matchesExpiry = !filters.expiryStatus || (() => {
        switch (filters.expiryStatus) {
          case 'valid': return !prescription.isExpired && prescription.daysToExpiry > 7;
          case 'expiring': return !prescription.isExpired && prescription.daysToExpiry <= 7;
          case 'expired': return prescription.isExpired;
          default: return true;
        }
      })();

      const matchesSchedule = !filters.scheduleType || 
        prescription.medicines.some(med => med.scheduleType === filters.scheduleType);

      const matchesDoctor = !filters.doctorName || 
        prescription.doctorName.toLowerCase().includes(filters.doctorName.toLowerCase());

      return matchesSearch && matchesValidation && matchesFulfillment && matchesExpiry && matchesSchedule && matchesDoctor;
    });
  };

  // Get prescription by ID
  const getPrescriptionById = (id) => {
    return prescriptions.find(prescription => prescription.id === id);
  };

  // Add new prescription
  const addPrescription = (prescriptionData) => {
    const newPrescription = {
      ...prescriptionData,
      id: `RX${String(prescriptions.length + 1).padStart(4, '0')}`,
      uploadDate: new Date(),
      validationStatus: 'pending',
      fulfillmentStatus: 'pending',
      createdBy: 'Current User',
      lastModified: new Date()
    };
    
    setPrescriptions(prev => [newPrescription, ...prev]);
    return newPrescription;
  };

  // Update prescription
  const updatePrescription = (prescriptionId, updates) => {
    setPrescriptions(prev => prev.map(prescription => 
      prescription.id === prescriptionId 
        ? { ...prescription, ...updates, lastModified: new Date() }
        : prescription
    ));
  };

  // Validate prescription
  const validatePrescription = (prescriptionId, status, notes = '', validatedBy = 'Dr. Sathya') => {
    updatePrescription(prescriptionId, {
      validationStatus: status,
      validationNotes: notes,
      validatedBy: validatedBy,
      validationDate: new Date()
    });
  };

  // Update fulfillment status
  const updateFulfillment = (prescriptionId, medicineId, fulfilledQuantity, invoiceId = null) => {
    const prescription = getPrescriptionById(prescriptionId);
    if (!prescription) return;

    const updatedMedicines = prescription.medicines.map(med => {
      if (med.id === medicineId) {
        return {
          ...med,
          fulfilled: fulfilledQuantity > 0,
          fulfilledQuantity: fulfilledQuantity,
          fulfilledDate: fulfilledQuantity > 0 ? new Date() : null
        };
      }
      return med;
    });

    const allFulfilled = updatedMedicines.every(med => med.fulfilled);
    const partiallyFulfilled = updatedMedicines.some(med => med.fulfilled) && !allFulfilled;
    
    let fulfillmentStatus = 'pending';
    if (allFulfilled) fulfillmentStatus = 'fulfilled';
    else if (partiallyFulfilled) fulfillmentStatus = 'partial';

    const linkedInvoices = invoiceId ? [...(prescription.linkedInvoices || []), invoiceId] : prescription.linkedInvoices;

    updatePrescription(prescriptionId, {
      medicines: updatedMedicines,
      fulfillmentStatus: fulfillmentStatus,
      linkedInvoices: linkedInvoices
    });
  };

  // Get prescription analytics
  const getPrescriptionAnalytics = () => {
    const total = prescriptions.length;
    const pending = prescriptions.filter(p => p.validationStatus === 'pending').length;
    const approved = prescriptions.filter(p => p.validationStatus === 'approved').length;
    const rejected = prescriptions.filter(p => p.validationStatus === 'rejected').length;
    const expired = prescriptions.filter(p => p.isExpired).length;
    const expiringSoon = prescriptions.filter(p => !p.isExpired && p.daysToExpiry <= 7).length;
    const fulfilled = prescriptions.filter(p => p.fulfillmentStatus === 'fulfilled').length;
    const partial = prescriptions.filter(p => p.fulfillmentStatus === 'partial').length;
    const restrictedMeds = prescriptions.filter(p => p.hasRestrictedMedicines).length;

    return {
      total,
      pending,
      approved,
      rejected,
      expired,
      expiringSoon,
      fulfilled,
      partial,
      restrictedMeds,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      fulfillmentRate: total > 0 ? Math.round((fulfilled / total) * 100) : 0
    };
  };

  const value = {
    prescriptions,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    getFilteredPrescriptions,
    getPrescriptionById,
    addPrescription,
    updatePrescription,
    validatePrescription,
    updateFulfillment,
    getPrescriptionAnalytics
  };

  return (
    <PrescriptionContext.Provider value={value}>
      {children}
    </PrescriptionContext.Provider>
  );
};
