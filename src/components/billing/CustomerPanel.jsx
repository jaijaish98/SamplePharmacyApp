import { useState } from 'react';
import { Search, Plus, User, Phone, Mail, Upload, Camera } from 'lucide-react';
import { useCustomer } from '../../contexts/CustomerContext';
import { useBilling } from '../../contexts/BillingContext';

const CustomerPanel = () => {
  const { customers, addCustomer } = useCustomer();
  const { currentBill, setCustomer, setPrescription } = useBilling();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: ''
  });

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5); // Show only top 5 results

  const handleCustomerSearch = (value) => {
    setSearchTerm(value);
    setShowSearchResults(value.length > 0);
  };

  const handleCustomerSelect = (customer) => {
    setCustomer(customer);
    setSearchTerm(customer.name);
    setShowSearchResults(false);
  };

  const handleAddNewCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert('Name and phone number are required');
      return;
    }

    const customer = addCustomer(newCustomer);
    setCustomer(customer);
    setSearchTerm(customer.name);
    setShowAddCustomer(false);
    setNewCustomer({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      address: ''
    });
  };

  const handlePrescriptionUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, this would upload the file and process it
      const prescription = {
        id: `RX${Date.now()}`,
        fileName: file.name,
        uploadDate: new Date(),
        fileSize: file.size,
        fileType: file.type
      };
      setPrescription(prescription);
    }
  };

  return (
    <div className="customer-panel">
      {/* Customer Search */}
      <div className="customer-search">
        <div className="search-input-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search customer by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => handleCustomerSearch(e.target.value)}
            className="customer-search-input"
          />
        </div>
        
        {showSearchResults && filteredCustomers.length > 0 && (
          <div className="search-results">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="search-result-item"
                onClick={() => handleCustomerSelect(customer)}
              >
                <div className="result-name">{customer.name}</div>
                <div className="result-details">
                  <span>{customer.phone}</span>
                  <span>{customer.email}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Customer Button */}
      <button 
        className="btn btn-outline btn-small"
        onClick={() => setShowAddCustomer(true)}
      >
        <Plus size={16} />
        Add New Customer
      </button>

      {/* Selected Customer Info */}
      {currentBill.customer && (
        <div className="customer-info">
          <div className="customer-name">
            <User size={16} />
            {currentBill.customer.name}
          </div>
          <div className="customer-details">
            <div>
              <Phone size={14} />
              {currentBill.customer.phone}
            </div>
            {currentBill.customer.email && (
              <div>
                <Mail size={14} />
                {currentBill.customer.email}
              </div>
            )}
            <div>Age: {currentBill.customer.age || 'N/A'}</div>
            <div>Gender: {currentBill.customer.gender || 'N/A'}</div>
          </div>
        </div>
      )}

      {/* Prescription Upload */}
      <div className="prescription-section">
        <h4>Prescription Upload</h4>
        <div className="upload-options">
          <label className="upload-btn">
            <Upload size={16} />
            Upload File
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handlePrescriptionUpload}
              style={{ display: 'none' }}
            />
          </label>
          <button className="upload-btn">
            <Camera size={16} />
            Take Photo
          </button>
        </div>
        
        {currentBill.prescription && (
          <div className="prescription-info">
            <div className="prescription-file">
              📄 {currentBill.prescription.fileName}
            </div>
            <div className="prescription-details">
              Uploaded: {new Date(currentBill.prescription.uploadDate).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Customer</h3>
              <button 
                className="btn-icon"
                onClick={() => setShowAddCustomer(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={newCustomer.age}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, age: e.target.value }))}
                    className="form-input"
                    min="1"
                    max="120"
                  />
                </div>
                
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={newCustomer.gender}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, gender: e.target.value }))}
                    className="form-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                    className="form-input"
                    rows="3"
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
                onClick={handleAddNewCustomer}
              >
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
