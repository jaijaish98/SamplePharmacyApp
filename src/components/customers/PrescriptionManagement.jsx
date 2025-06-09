import { useState } from 'react';
import { Upload, FileText, Search, Calendar, User, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';

const PrescriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock prescription data
  const prescriptions = [
    {
      id: 'RX001',
      customerName: 'Rajesh Kumar',
      customerPhone: '9876543210',
      doctorName: 'Dr. Sharma',
      uploadDate: new Date(),
      validityDays: 30,
      expiryDate: addDays(new Date(), 30),
      status: 'valid',
      medicines: ['Paracetamol 500mg - 2 times daily', 'Amoxicillin 250mg - 3 times daily'],
      fileName: 'prescription_001.pdf',
      reminderSent: false
    },
    {
      id: 'RX002',
      customerName: 'Priya Sharma',
      customerPhone: '9876543211',
      doctorName: 'Dr. Patel',
      uploadDate: addDays(new Date(), -45),
      validityDays: 30,
      expiryDate: addDays(new Date(), -15),
      status: 'expired',
      medicines: ['Insulin Pen - Once daily', 'Metformin 500mg - 2 times daily'],
      fileName: 'prescription_002.pdf',
      reminderSent: true
    },
    {
      id: 'RX003',
      customerName: 'Amit Patel',
      customerPhone: '9876543212',
      doctorName: 'Dr. Singh',
      uploadDate: addDays(new Date(), -20),
      validityDays: 90,
      expiryDate: addDays(new Date(), 70),
      status: 'valid',
      medicines: ['Vitamin D3 - Once daily', 'Calcium tablets - 2 times daily'],
      fileName: 'prescription_003.pdf',
      reminderSent: false
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Prescriptions', count: prescriptions.length },
    { id: 'valid', label: 'Valid', count: prescriptions.filter(p => p.status === 'valid').length },
    { id: 'expiring', label: 'Expiring Soon', count: prescriptions.filter(p => {
      const daysToExpiry = differenceInDays(new Date(p.expiryDate), new Date());
      return daysToExpiry <= 7 && daysToExpiry > 0;
    }).length },
    { id: 'expired', label: 'Expired', count: prescriptions.filter(p => p.status === 'expired').length }
  ];

  const getFilteredPrescriptions = () => {
    let filtered = prescriptions;

    if (activeTab !== 'all') {
      if (activeTab === 'expiring') {
        filtered = filtered.filter(p => {
          const daysToExpiry = differenceInDays(new Date(p.expiryDate), new Date());
          return daysToExpiry <= 7 && daysToExpiry > 0;
        });
      } else {
        filtered = filtered.filter(p => p.status === activeTab);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customerPhone.includes(searchTerm) ||
        p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusIcon = (prescription) => {
    const daysToExpiry = differenceInDays(new Date(prescription.expiryDate), new Date());
    
    if (prescription.status === 'expired') {
      return <AlertTriangle size={16} className="status-icon expired" />;
    } else if (daysToExpiry <= 7) {
      return <Clock size={16} className="status-icon expiring" />;
    } else {
      return <CheckCircle size={16} className="status-icon valid" />;
    }
  };

  const getStatusText = (prescription) => {
    const daysToExpiry = differenceInDays(new Date(prescription.expiryDate), new Date());
    
    if (prescription.status === 'expired') {
      return `Expired ${Math.abs(daysToExpiry)} days ago`;
    } else if (daysToExpiry <= 7) {
      return `Expires in ${daysToExpiry} days`;
    } else {
      return `Valid for ${daysToExpiry} days`;
    }
  };

  const filteredPrescriptions = getFilteredPrescriptions();

  return (
    <div className="customer-container">
      {/* Header */}
      <div className="prescription-header">
        <div className="header-content">
          <h3>Prescription Management</h3>
          <p>Upload, track, and manage customer prescriptions</p>
        </div>
        <button className="btn btn-primary">
          <Upload size={16} />
          Upload Prescription
        </button>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer name, phone, doctor, or prescription ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="prescription-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Prescription List */}
      <div className="prescription-list">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="prescription-card">
            <div className="prescription-header">
              <div className="prescription-info">
                <div className="prescription-id">{prescription.id}</div>
                <div className="customer-info">
                  <User size={14} />
                  <span>{prescription.customerName}</span>
                  <span className="phone">{prescription.customerPhone}</span>
                </div>
              </div>
              <div className="prescription-status">
                {getStatusIcon(prescription)}
                <span className={`status-text ${prescription.status}`}>
                  {getStatusText(prescription)}
                </span>
              </div>
            </div>

            <div className="prescription-details">
              <div className="prescription-meta">
                <div className="meta-item">
                  <strong>Doctor:</strong> {prescription.doctorName}
                </div>
                <div className="meta-item">
                  <strong>Uploaded:</strong> {format(new Date(prescription.uploadDate), 'dd/MM/yyyy')}
                </div>
                <div className="meta-item">
                  <strong>Validity:</strong> {prescription.validityDays} days
                </div>
                <div className="meta-item">
                  <strong>Expires:</strong> {format(new Date(prescription.expiryDate), 'dd/MM/yyyy')}
                </div>
              </div>

              <div className="prescription-medicines">
                <strong>Prescribed Medicines:</strong>
                <ul>
                  {prescription.medicines.map((medicine, index) => (
                    <li key={index}>{medicine}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="prescription-actions">
              <button className="btn btn-outline btn-small">
                <FileText size={14} />
                View
              </button>
              <button className="btn btn-outline btn-small">
                Download
              </button>
              {prescription.status === 'valid' && !prescription.reminderSent && (
                <button className="btn btn-primary btn-small">
                  Send Reminder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrescriptions.length === 0 && (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No prescriptions found</h3>
          <p>No prescriptions match your current filters</p>
        </div>
      )}

      {/* Upload Modal would go here */}
    </div>
  );
};

export default PrescriptionManagement;
