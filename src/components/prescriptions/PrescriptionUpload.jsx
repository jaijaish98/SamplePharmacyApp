import { useState, useRef } from 'react';
import { Upload, Camera, FileText, X, Save, User, Calendar, Clock } from 'lucide-react';
import { usePrescriptions } from '../../contexts/PrescriptionContext';

const PrescriptionUpload = ({ prescription, onSave, onCancel }) => {
  const { addPrescription, updatePrescription } = usePrescriptions();
  const isEditing = !!prescription;
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [formData, setFormData] = useState({
    customerId: prescription?.customerId || '',
    customerName: prescription?.customerName || '',
    customerPhone: prescription?.customerPhone || '',
    doctorName: prescription?.doctorName || '',
    doctorRegNo: prescription?.doctorRegNo || '',
    doctorSpecialization: prescription?.doctorSpecialization || '',
    validityDays: prescription?.validityDays || 30,
    notes: prescription?.notes || '',
    medicines: prescription?.medicines || []
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  // Mock customer data for autocomplete
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone
    }));
  };

  const handleDoctorSelect = (doctor) => {
    setFormData(prev => ({
      ...prev,
      doctorName: doctor.name,
      doctorRegNo: doctor.regNo,
      doctorSpecialization: doctor.specialization
    }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, file: 'Please upload a JPG, PNG, or PDF file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, file: 'File size must be less than 5MB' }));
      return;
    }

    setUploadedFile(file);
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Customer phone is required';
    }

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = 'Doctor name is required';
    }

    if (!formData.doctorRegNo.trim()) {
      newErrors.doctorRegNo = 'Doctor registration number is required';
    }

    if (!uploadedFile && !isEditing) {
      newErrors.file = 'Please upload a prescription file';
    }

    if (!formData.validityDays || formData.validityDays < 1 || formData.validityDays > 365) {
      newErrors.validityDays = 'Validity must be between 1 and 365 days';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setUploading(true);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      const prescriptionData = {
        ...formData,
        fileName: uploadedFile ? uploadedFile.name : prescription?.fileName,
        fileSize: uploadedFile ? Math.round(uploadedFile.size / 1024) : prescription?.fileSize,
        fileType: uploadedFile ? uploadedFile.type : prescription?.fileType,
        expiryDate: new Date(Date.now() + formData.validityDays * 24 * 60 * 60 * 1000),
        validationStatus: 'pending',
        fulfillmentStatus: 'pending'
      };

      if (isEditing) {
        updatePrescription(prescription.id, prescriptionData);
      } else {
        addPrescription(prescriptionData);
      }

      onSave();
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: 'Failed to upload prescription. Please try again.' }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="prescription-container">
      <div className="prescription-section">
        <div className="section-header">
          <h3>{isEditing ? 'Edit Prescription' : 'Upload New Prescription'}</h3>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={onCancel}>
              <X size={16} />
              Cancel
            </button>
            <button 
              className={`btn btn-primary ${uploading ? 'loading' : ''}`} 
              onClick={handleSubmit}
              disabled={uploading}
            >
              <Save size={16} />
              {uploading ? 'Uploading...' : isEditing ? 'Update Prescription' : 'Upload Prescription'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="upload-container">
          {/* File Upload Section */}
          {!isEditing && (
            <div className="prescription-section">
              <h4>Upload Prescription File</h4>
              <div 
                className={`upload-zone ${dragOver ? 'dragover' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-icon">
                  <Upload size={48} />
                </div>
                <div className="upload-text">
                  {uploadedFile ? uploadedFile.name : 'Drop prescription file here or click to browse'}
                </div>
                <div className="upload-hint">
                  Supports JPG, PNG, PDF files up to 5MB
                </div>
                <div className="upload-options">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <FileText size={16} />
                    Browse Files
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                  >
                    <Camera size={16} />
                    Take Photo
                  </button>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="file-input"
              />
              
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="file-input"
              />
              
              {errors.file && <span className="error-text">{errors.file}</span>}
            </div>
          )}

          {/* File Preview */}
          {uploadedFile && (
            <div className="file-preview">
              <div className="file-icon">
                <FileText size={24} />
              </div>
              <div className="file-info">
                <div className="file-name">{uploadedFile.name}</div>
                <div className="file-size">{Math.round(uploadedFile.size / 1024)} KB</div>
              </div>
              <div className="file-actions">
                <button 
                  type="button"
                  className="btn-icon"
                  onClick={() => setUploadedFile(null)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="prescription-section">
            <h4>Customer Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="required">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className={`form-input ${errors.customerName ? 'error' : ''}`}
                  placeholder="Enter customer name"
                  list="customers"
                />
                <datalist id="customers">
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.name} />
                  ))}
                </datalist>
                {errors.customerName && <span className="error-text">{errors.customerName}</span>}
              </div>

              <div className="form-group">
                <label className="required">Phone Number</label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className={`form-input ${errors.customerPhone ? 'error' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.customerPhone && <span className="error-text">{errors.customerPhone}</span>}
              </div>
            </div>

            {/* Customer Quick Select */}
            <div className="customer-suggestions">
              <h5>Quick Select Customer:</h5>
              <div className="customer-chips">
                {customers.slice(0, 5).map(customer => (
                  <button
                    key={customer.id}
                    type="button"
                    className="customer-chip"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <User size={14} />
                    {customer.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="prescription-section">
            <h4>Doctor Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="required">Doctor Name</label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  className={`form-input ${errors.doctorName ? 'error' : ''}`}
                  placeholder="Enter doctor name"
                  list="doctors"
                />
                <datalist id="doctors">
                  {doctors.map(doctor => (
                    <option key={doctor.regNo} value={doctor.name} />
                  ))}
                </datalist>
                {errors.doctorName && <span className="error-text">{errors.doctorName}</span>}
              </div>

              <div className="form-group">
                <label className="required">Registration Number</label>
                <input
                  type="text"
                  value={formData.doctorRegNo}
                  onChange={(e) => handleInputChange('doctorRegNo', e.target.value)}
                  className={`form-input ${errors.doctorRegNo ? 'error' : ''}`}
                  placeholder="Enter registration number"
                />
                {errors.doctorRegNo && <span className="error-text">{errors.doctorRegNo}</span>}
              </div>

              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  value={formData.doctorSpecialization}
                  onChange={(e) => handleInputChange('doctorSpecialization', e.target.value)}
                  className="form-input"
                  placeholder="Enter specialization"
                />
              </div>
            </div>

            {/* Doctor Quick Select */}
            <div className="doctor-suggestions">
              <h5>Quick Select Doctor:</h5>
              <div className="doctor-chips">
                {doctors.slice(0, 5).map(doctor => (
                  <button
                    key={doctor.regNo}
                    type="button"
                    className="doctor-chip"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    {doctor.name} - {doctor.specialization}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prescription Details */}
          <div className="prescription-section">
            <h4>Prescription Details</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="required">Validity Period</label>
                <select
                  value={formData.validityDays}
                  onChange={(e) => handleInputChange('validityDays', parseInt(e.target.value))}
                  className={`form-select ${errors.validityDays ? 'error' : ''}`}
                >
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>180 days</option>
                  <option value={365}>1 year</option>
                </select>
                {errors.validityDays && <span className="error-text">{errors.validityDays}</span>}
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="form-textarea"
                  placeholder="Enter any additional notes or instructions"
                  rows="3"
                />
              </div>
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

export default PrescriptionUpload;
