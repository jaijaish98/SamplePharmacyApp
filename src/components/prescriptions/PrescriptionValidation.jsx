import { useState } from 'react';
import { CheckCircle, X, AlertTriangle, Eye, FileText, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { usePrescriptions } from '../../contexts/PrescriptionContext';

const PrescriptionValidation = () => {
  const { getFilteredPrescriptions, validatePrescription, loading } = usePrescriptions();
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [validationNotes, setValidationNotes] = useState('');

  // Get pending prescriptions
  const pendingPrescriptions = getFilteredPrescriptions().filter(p => p.validationStatus === 'pending');

  const handleValidate = (prescriptionId, status) => {
    validatePrescription(prescriptionId, status, validationNotes);
    setSelectedPrescription(null);
    setValidationNotes('');
  };

  const getRestrictedMedicines = (medicines) => {
    return medicines.filter(med => ['H', 'H1', 'X'].includes(med.scheduleType));
  };

  if (loading) {
    return (
      <div className="prescription-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading validation queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prescription-container">
      <div className="prescription-section">
        <h3>Prescription Validation Queue ({pendingPrescriptions.length} pending)</h3>
        <p>Review and validate uploaded prescriptions before fulfillment</p>
      </div>

      <div className="validation-queue">
        {pendingPrescriptions.map((prescription) => {
          const restrictedMeds = getRestrictedMedicines(prescription.medicines);
          
          return (
            <div key={prescription.id} className="validation-card">
              <div className="validation-header">
                <div className="prescription-info">
                  <div className="prescription-id">{prescription.id}</div>
                  <div className="prescription-customer">
                    <User size={14} />
                    <span>{prescription.customerName}</span>
                    <span className="phone">({prescription.customerPhone})</span>
                  </div>
                  <div className="prescription-doctor">
                    <FileText size={14} />
                    <span>{prescription.doctorName}</span>
                    <span>Reg: {prescription.doctorRegNo}</span>
                  </div>
                </div>
                
                <div className="validation-actions">
                  <button 
                    className="btn btn-outline btn-small"
                    onClick={() => setSelectedPrescription(prescription)}
                  >
                    <Eye size={14} />
                    Review
                  </button>
                </div>
              </div>

              <div className="prescription-meta">
                <div className="meta-item">
                  <span className="meta-label">Upload Date</span>
                  <span className="meta-value">{format(new Date(prescription.uploadDate), 'dd/MM/yyyy HH:mm')}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">File Type</span>
                  <span className="meta-value">{prescription.fileName.split('.').pop().toUpperCase()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Validity</span>
                  <span className="meta-value">{prescription.validityDays} days</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Medicines</span>
                  <span className="meta-value">{prescription.medicines.length} items</span>
                </div>
              </div>

              <div className="prescription-medicines">
                <h5>Prescribed Medicines</h5>
                <div className="medicine-list">
                  {prescription.medicines.map((medicine) => (
                    <div key={medicine.id} className="medicine-item">
                      <div>
                        <div className="medicine-name">{medicine.name}</div>
                        <div className="medicine-dosage">{medicine.dosage}</div>
                        <div className="medicine-quantity">Quantity: {medicine.quantity}</div>
                      </div>
                      <div className="medicine-badges">
                        <span className={`medicine-schedule ${medicine.scheduleType.toLowerCase()}`}>
                          {medicine.scheduleType}
                        </span>
                        {!medicine.inStock && (
                          <span className="stock-badge out-of-stock">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {restrictedMeds.length > 0 && (
                <div className="compliance-alert">
                  <AlertTriangle size={16} />
                  <span>
                    Contains {restrictedMeds.length} restricted medicine(s) - Verify doctor registration
                  </span>
                </div>
              )}

              {prescription.notes && (
                <div className="prescription-notes">
                  <strong>Notes:</strong> {prescription.notes}
                </div>
              )}

              <div className="validation-actions">
                <button 
                  className="btn btn-success btn-small"
                  onClick={() => handleValidate(prescription.id, 'approved')}
                >
                  <CheckCircle size={14} />
                  Approve
                </button>
                <button 
                  className="btn btn-danger btn-small"
                  onClick={() => setSelectedPrescription(prescription)}
                >
                  <X size={14} />
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Validation Modal */}
      {selectedPrescription && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Validate Prescription {selectedPrescription.id}</h4>
              <button 
                className="btn-icon"
                onClick={() => setSelectedPrescription(null)}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="prescription-preview">
                <div className="file-preview">
                  <div className="file-icon">
                    <FileText size={48} />
                  </div>
                  <div className="file-info">
                    <div className="file-name">{selectedPrescription.fileName}</div>
                    <div className="file-size">{selectedPrescription.fileSize} KB</div>
                  </div>
                </div>
              </div>

              <div className="validation-form">
                <div className="form-group">
                  <label>Validation Notes</label>
                  <textarea
                    value={validationNotes}
                    onChange={(e) => setValidationNotes(e.target.value)}
                    className="validation-notes"
                    placeholder="Enter validation notes (required for rejection)"
                    rows="4"
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setSelectedPrescription(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success"
                onClick={() => handleValidate(selectedPrescription.id, 'approved')}
              >
                <CheckCircle size={16} />
                Approve
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleValidate(selectedPrescription.id, 'rejected')}
                disabled={!validationNotes.trim()}
              >
                <X size={16} />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingPrescriptions.length === 0 && (
        <div className="empty-state">
          <CheckCircle size={48} />
          <h3>No prescriptions pending validation</h3>
          <p>All uploaded prescriptions have been validated</p>
        </div>
      )}
    </div>
  );
};

export default PrescriptionValidation;
