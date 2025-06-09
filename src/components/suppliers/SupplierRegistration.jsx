import { useState } from 'react';
import { Save, X, User, Phone, Mail, MapPin, CreditCard, Building, Star } from 'lucide-react';
import { useSuppliers } from '../../contexts/SupplierContext';

const SupplierRegistration = ({ supplier, onSave, onCancel }) => {
  const { addSupplier, updateSupplier } = useSuppliers();
  const isEditing = !!supplier;

  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    supplierType: supplier?.supplierType || 'Wholesaler',
    contactPerson: supplier?.contactPerson || '',
    phone: supplier?.phone || '',
    email: supplier?.email || '',
    gstin: supplier?.gstin || '',
    panNumber: supplier?.panNumber || '',
    billingAddress: supplier?.billingAddress || '',
    shippingAddress: supplier?.shippingAddress || '',
    paymentTerms: supplier?.paymentTerms || 'Net 30',
    deliveryTime: supplier?.deliveryTime || 7,
    bankAccount: {
      accountNumber: supplier?.bankAccount?.accountNumber || '',
      ifscCode: supplier?.bankAccount?.ifscCode || '',
      bankName: supplier?.bankAccount?.bankName || '',
      accountHolder: supplier?.bankAccount?.accountHolder || ''
    },
    rating: supplier?.rating || 5.0,
    notes: supplier?.notes || ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [sameAsbilling, setSameAsBilling] = useState(false);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSameAsBilling = (checked) => {
    setSameAsBilling(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: prev.billingAddress
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.gstin.trim()) {
      newErrors.gstin = 'GSTIN is required';
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
      newErrors.gstin = 'Please enter a valid GSTIN';
    }

    if (!formData.panNumber.trim()) {
      newErrors.panNumber = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = 'Please enter a valid PAN number';
    }

    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }

    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'Shipping address is required';
    }

    if (!formData.deliveryTime || formData.deliveryTime < 1 || formData.deliveryTime > 365) {
      newErrors.deliveryTime = 'Delivery time must be between 1 and 365 days';
    }

    if (formData.bankAccount.accountNumber && !formData.bankAccount.ifscCode) {
      newErrors['bankAccount.ifscCode'] = 'IFSC code is required when account number is provided';
    }

    if (formData.bankAccount.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankAccount.ifscCode)) {
      newErrors['bankAccount.ifscCode'] = 'Please enter a valid IFSC code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isEditing) {
        updateSupplier(supplier.id, formData);
      } else {
        addSupplier(formData);
      }

      onSave();
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: 'Failed to save supplier. Please try again.' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="supplier-container">
      <div className="supplier-section">
        <div className="section-header">
          <h3>{isEditing ? 'Edit Supplier' : 'Register New Supplier'}</h3>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={onCancel}>
              <X size={16} />
              Cancel
            </button>
            <button 
              className={`btn btn-primary ${saving ? 'loading' : ''}`} 
              onClick={handleSubmit}
              disabled={saving}
            >
              <Save size={16} />
              {saving ? 'Saving...' : isEditing ? 'Update Supplier' : 'Register Supplier'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="supplier-form">
          {/* Basic Information */}
          <div className="supplier-section">
            <h4>Basic Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">Supplier Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter supplier name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">Supplier Type</label>
                <select
                  value={formData.supplierType}
                  onChange={(e) => handleInputChange('supplierType', e.target.value)}
                  className="form-select"
                >
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Local">Local</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label required">Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  className={`form-input ${errors.contactPerson ? 'error' : ''}`}
                  placeholder="Enter contact person name"
                />
                {errors.contactPerson && <span className="error-text">{errors.contactPerson}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">Email ID</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* Legal Information */}
          <div className="supplier-section">
            <h4>Legal Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">GSTIN</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                  className={`form-input ${errors.gstin ? 'error' : ''}`}
                  placeholder="Enter GSTIN (15 characters)"
                  maxLength="15"
                />
                {errors.gstin && <span className="error-text">{errors.gstin}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">PAN Number</label>
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                  className={`form-input ${errors.panNumber ? 'error' : ''}`}
                  placeholder="Enter PAN number (10 characters)"
                  maxLength="10"
                />
                {errors.panNumber && <span className="error-text">{errors.panNumber}</span>}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="supplier-section">
            <h4>Address Information</h4>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label required">Billing Address</label>
                <textarea
                  value={formData.billingAddress}
                  onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                  className={`form-textarea ${errors.billingAddress ? 'error' : ''}`}
                  placeholder="Enter complete billing address"
                  rows="3"
                />
                {errors.billingAddress && <span className="error-text">{errors.billingAddress}</span>}
              </div>

              <div className="form-group full-width">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={sameAsBinding}
                      onChange={(e) => handleSameAsBilling(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Shipping address same as billing address
                  </label>
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label required">Shipping Address</label>
                <textarea
                  value={formData.shippingAddress}
                  onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                  className={`form-textarea ${errors.shippingAddress ? 'error' : ''}`}
                  placeholder="Enter complete shipping address"
                  rows="3"
                  disabled={sameAsBinding}
                />
                {errors.shippingAddress && <span className="error-text">{errors.shippingAddress}</span>}
              </div>
            </div>
          </div>

          {/* Business Terms */}
          <div className="supplier-section">
            <h4>Business Terms</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">Payment Terms</label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  className="form-select"
                >
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="COD">COD</option>
                  <option value="Advance">Advance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label required">Delivery Time (Days)</label>
                <input
                  type="number"
                  value={formData.deliveryTime}
                  onChange={(e) => handleInputChange('deliveryTime', parseInt(e.target.value))}
                  className={`form-input ${errors.deliveryTime ? 'error' : ''}`}
                  placeholder="Enter delivery time in days"
                  min="1"
                  max="365"
                />
                {errors.deliveryTime && <span className="error-text">{errors.deliveryTime}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                  className="form-select"
                >
                  <option value="5.0">5.0 - Excellent</option>
                  <option value="4.5">4.5 - Very Good</option>
                  <option value="4.0">4.0 - Good</option>
                  <option value="3.5">3.5 - Average</option>
                  <option value="3.0">3.0 - Below Average</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="supplier-section">
            <h4>Bank Account Details (Optional)</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  value={formData.bankAccount.accountNumber}
                  onChange={(e) => handleInputChange('bankAccount.accountNumber', e.target.value)}
                  className="form-input"
                  placeholder="Enter account number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input
                  type="text"
                  value={formData.bankAccount.ifscCode}
                  onChange={(e) => handleInputChange('bankAccount.ifscCode', e.target.value.toUpperCase())}
                  className={`form-input ${errors['bankAccount.ifscCode'] ? 'error' : ''}`}
                  placeholder="Enter IFSC code"
                  maxLength="11"
                />
                {errors['bankAccount.ifscCode'] && <span className="error-text">{errors['bankAccount.ifscCode']}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankAccount.bankName}
                  onChange={(e) => handleInputChange('bankAccount.bankName', e.target.value)}
                  className="form-input"
                  placeholder="Enter bank name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Holder Name</label>
                <input
                  type="text"
                  value={formData.bankAccount.accountHolder}
                  onChange={(e) => handleInputChange('bankAccount.accountHolder', e.target.value)}
                  className="form-input"
                  placeholder="Enter account holder name"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="supplier-section">
            <h4>Additional Notes</h4>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="form-textarea"
                placeholder="Enter any additional notes about the supplier"
                rows="3"
              />
            </div>
          </div>

          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SupplierRegistration;
