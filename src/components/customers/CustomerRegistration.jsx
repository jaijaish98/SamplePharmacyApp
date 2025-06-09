import { useState, useEffect } from 'react';
import { Save, X, Phone, Mail, MapPin, Heart, AlertTriangle, Tag, Building } from 'lucide-react';
import { useCustomers } from '../../contexts/CustomerContext';

const CustomerRegistration = ({ customer, onSave, onCancel }) => {
  const { addCustomer, updateCustomer } = useCustomers();
  const isEditing = !!customer;

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    gstin: '',
    emergencyContact: '',
    allergies: [],
    chronicConditions: [],
    notes: '',
    tags: [],
    mobileVerified: false,
    emailVerified: false,
    preferredPaymentMethod: 'Cash',
    discountEligible: false,
    birthdayOffers: true
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        ...customer,
        dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth).toISOString().split('T')[0] : '',
        allergies: customer.allergies || [],
        chronicConditions: customer.chronicConditions || [],
        tags: customer.tags || []
      });
    }
  }, [customer]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayInputChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (formData.age && (formData.age < 1 || formData.age > 120)) {
      newErrors.age = 'Please enter a valid age';
    }

    if (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
      newErrors.gstin = 'Please enter a valid GSTIN';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = () => {
    if (!formData.phone.trim()) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required for OTP verification' }));
      return;
    }
    
    // Simulate OTP sending
    setOtpSent(true);
    console.log(`OTP sent to ${formData.phone}`);
  };

  const handleVerifyOTP = () => {
    // Simulate OTP verification
    if (otp === '123456') {
      setFormData(prev => ({ ...prev, mobileVerified: true }));
      setOtpSent(false);
      setOtp('');
    } else {
      setErrors(prev => ({ ...prev, otp: 'Invalid OTP. Use 123456 for demo.' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const customerData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
    };

    if (isEditing) {
      updateCustomer(customer.id, customerData);
    } else {
      addCustomer(customerData);
    }

    onSave();
  };

  return (
    <div className="customer-container">
      <div className="customer-section">
        <div className="section-header">
          <h3>{isEditing ? 'Edit Customer' : 'Register New Customer'}</h3>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={onCancel}>
              <X size={16} />
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              <Save size={16} />
              {isEditing ? 'Update Customer' : 'Register Customer'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="customer-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="required">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter full name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className={`form-input ${errors.age ? 'error' : ''}`}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                />
                {errors.age && <span className="error-text">{errors.age}</span>}
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="required">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`form-select ${errors.gender ? 'error' : ''}`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="error-text">{errors.gender}</span>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="required">Mobile Number</label>
                <div className="input-with-action">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="Enter 10-digit mobile number"
                  />
                  {!formData.mobileVerified && (
                    <button
                      type="button"
                      className="btn btn-outline btn-small"
                      onClick={handleSendOTP}
                      disabled={otpSent}
                    >
                      <Phone size={14} />
                      {otpSent ? 'OTP Sent' : 'Verify'}
                    </button>
                  )}
                  {formData.mobileVerified && (
                    <span className="verification-badge verified">
                      ✓ Verified
                    </span>
                  )}
                </div>
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {otpSent && (
                <div className="form-group">
                  <label>Enter OTP</label>
                  <div className="input-with-action">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={`form-input ${errors.otp ? 'error' : ''}`}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-small"
                      onClick={handleVerifyOTP}
                    >
                      Verify OTP
                    </button>
                  </div>
                  {errors.otp && <span className="error-text">{errors.otp}</span>}
                  <small className="help-text">Demo OTP: 123456</small>
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter email address (optional)"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Emergency Contact</label>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="form-input"
                  placeholder="Emergency contact number"
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="form-textarea"
                  placeholder="Enter complete address (optional)"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="form-section">
            <h3>Business Information (Optional)</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>GSTIN</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                  className={`form-input ${errors.gstin ? 'error' : ''}`}
                  placeholder="Enter GSTIN for B2B customers"
                />
                {errors.gstin && <span className="error-text">{errors.gstin}</span>}
              </div>

              <div className="form-group">
                <label>Preferred Payment Method</label>
                <select
                  value={formData.preferredPaymentMethod}
                  onChange={(e) => handleInputChange('preferredPaymentMethod', e.target.value)}
                  className="form-select"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="form-section">
            <h3>Medical Information (Optional)</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Allergies</label>
                <input
                  type="text"
                  value={formData.allergies.join(', ')}
                  onChange={(e) => handleArrayInputChange('allergies', e.target.value)}
                  className="form-input"
                  placeholder="Enter allergies separated by commas"
                />
                <small className="help-text">e.g., Penicillin, Sulfa drugs, Aspirin</small>
              </div>

              <div className="form-group">
                <label>Chronic Conditions</label>
                <input
                  type="text"
                  value={formData.chronicConditions.join(', ')}
                  onChange={(e) => handleArrayInputChange('chronicConditions', e.target.value)}
                  className="form-input"
                  placeholder="Enter conditions separated by commas"
                />
                <small className="help-text">e.g., Diabetes, Hypertension, Asthma</small>
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="form-textarea"
                  placeholder="Additional notes about the customer"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Tags and Preferences */}
          <div className="form-section">
            <h3>Tags and Preferences</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Customer Tags</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                  className="form-input"
                  placeholder="Enter tags separated by commas"
                />
                <small className="help-text">e.g., Regular Customer, VIP, Elderly, Diabetic</small>
              </div>

              <div className="form-group">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.discountEligible}
                      onChange={(e) => handleInputChange('discountEligible', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Eligible for discounts
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.birthdayOffers}
                      onChange={(e) => handleInputChange('birthdayOffers', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Send birthday offers
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegistration;
