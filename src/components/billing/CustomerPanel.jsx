import React, { useState } from 'react';
import {
  Search,
  User,
  Phone,
  Mail,
  Plus,
  Upload,
  Camera,
  X,
  Check,
  Edit3
} from 'lucide-react';
import './CustomerPanel.css';

const CustomerPanel = ({ customer, setCustomer }) => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    address: ''
  });
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  // Sample customer data
  const [customers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      phone: '9876543210',
      email: 'rajesh.kumar@email.com',
      address: '123 Main Street, Chennai'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: 32,
      gender: 'Female',
      phone: '9876543211',
      email: 'priya.sharma@email.com',
      address: '456 Park Avenue, Chennai'
    },
    {
      id: 3,
      name: 'Suresh Patel',
      age: 58,
      gender: 'Male',
      phone: '9876543212',
      email: 'suresh.patel@email.com',
      address: '789 Garden Road, Chennai'
    }
  ]);

  const filteredCustomers = customers.filter(cust =>
    cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.phone.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      const customerToAdd = {
        id: Date.now(),
        ...newCustomer,
        age: parseInt(newCustomer.age) || 0
      };
      setCustomer(customerToAdd);
      setNewCustomer({
        name: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        address: ''
      });
      setShowAddCustomer(false);
    }
  };

  const handlePrescriptionUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPrescriptionFile(file);
    }
  };

  const clearCustomer = () => {
    setCustomer(null);
    setPrescriptionFile(null);
  };

  return (
    <div className="customer-panel">
      <div className="customer-panel-header">
        <h2>Customer Information</h2>
        {customer && (
          <button className="btn btn-outline btn-sm" onClick={clearCustomer}>
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      {!customer ? (
        <div className="customer-search-section">
          {/* Customer Search */}
          <div className="customer-search">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search customer by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddCustomer(true)}
            >
              <Plus size={18} />
              Add New
            </button>
          </div>

          {/* Customer Search Results */}
          {searchTerm && (
            <div className="customer-results">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(cust => (
                  <div 
                    key={cust.id} 
                    className="customer-result-item"
                    onClick={() => setCustomer(cust)}
                  >
                    <div className="customer-info">
                      <h4>{cust.name}</h4>
                      <p>{cust.phone}</p>
                      <p>{cust.age} years, {cust.gender}</p>
                    </div>
                    <button className="btn btn-sm btn-primary">
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No customers found</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddCustomer(true)}
                  >
                    Add New Customer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Walk-in Customer Option */}
          <div className="walk-in-option">
            <button 
              className="btn btn-secondary btn-large"
              onClick={() => setCustomer({ id: 'walk-in', name: 'Walk-in Customer' })}
            >
              <User size={20} />
              Continue as Walk-in Customer
            </button>
          </div>
        </div>
      ) : (
        <div className="customer-details">
          <div className="customer-info-display">
            <div className="customer-basic-info">
              <div className="customer-avatar">
                <User size={24} />
              </div>
              <div className="customer-data">
                <h3>{customer.name}</h3>
                {customer.phone && (
                  <p className="customer-contact">
                    <Phone size={16} />
                    {customer.phone}
                  </p>
                )}
                {customer.email && (
                  <p className="customer-contact">
                    <Mail size={16} />
                    {customer.email}
                  </p>
                )}
                {customer.age && customer.gender && (
                  <p className="customer-demographics">
                    {customer.age} years, {customer.gender}
                  </p>
                )}
              </div>
            </div>
            
            <button className="btn btn-outline btn-sm">
              <Edit3 size={16} />
              Edit
            </button>
          </div>

          {/* Prescription Upload */}
          <div className="prescription-section">
            <h4>Prescription</h4>
            <div className="prescription-upload">
              <input
                type="file"
                id="prescription-upload"
                accept="image/*,.pdf"
                onChange={handlePrescriptionUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="prescription-upload" className="upload-btn">
                <Upload size={18} />
                Upload Prescription
              </label>
              <button className="btn btn-outline">
                <Camera size={18} />
                Take Photo
              </button>
            </div>
            
            {prescriptionFile && (
              <div className="prescription-preview">
                <p>📄 {prescriptionFile.name}</p>
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => setPrescriptionFile(null)}
                >
                  <X size={14} />
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Customer</h3>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setShowAddCustomer(false)}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={newCustomer.age}
                    onChange={(e) => setNewCustomer({...newCustomer, age: e.target.value})}
                    placeholder="Enter age"
                  />
                </div>
                
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={newCustomer.gender}
                    onChange={(e) => setNewCustomer({...newCustomer, gender: e.target.value})}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group form-group-full">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="form-group form-group-full">
                  <label>Address</label>
                  <textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    placeholder="Enter address"
                    rows="2"
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowAddCustomer(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddCustomer}
                disabled={!newCustomer.name || !newCustomer.phone}
              >
                <Check size={16} />
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPanel;
