import { useState } from 'react';
import { ArrowLeft, Edit, Download, CheckCircle, X, AlertTriangle, User, FileText, Calendar, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const PrescriptionDetail = ({ prescription, onBack, onEdit }) => {
  const [activeSection, setActiveSection] = useState('details');

  const getExpiryStatus = () => {
    if (prescription.isExpired) {
      return { status: 'expired', text: 'Expired', color: '#ef4444' };
    } else if (prescription.daysToExpiry <= 7) {
      return { status: 'expiring', text: `Expires in ${prescription.daysToExpiry} days`, color: '#f59e0b' };
    } else {
      return { status: 'valid', text: `Valid for ${prescription.daysToExpiry} days`, color: '#10b981' };
    }
  };

  const getValidationIcon = () => {
    switch (prescription.validationStatus) {
      case 'approved':
        return <CheckCircle size={20} style={{ color: '#10b981' }} />;
      case 'rejected':
        return <X size={20} style={{ color: '#ef4444' }} />;
      default:
        return <Clock size={20} style={{ color: '#f59e0b' }} />;
    }
  };

  const getFulfillmentProgress = () => {
    const totalMedicines = prescription.medicines.length;
    const fulfilledMedicines = prescription.medicines.filter(med => med.fulfilled).length;
    return Math.round((fulfilledMedicines / totalMedicines) * 100);
  };

  const expiryStatus = getExpiryStatus();
  const fulfillmentProgress = getFulfillmentProgress();

  const sections = [
    { id: 'details', label: 'Prescription Details', icon: FileText },
    { id: 'medicines', label: 'Medicines', icon: CheckCircle },
    { id: 'history', label: 'History & Audit', icon: Clock }
  ];

  const renderDetails = () => (
    <div className="prescription-details">
      <div className="details-grid">
        <div className="detail-section">
          <h4>Customer Information</h4>
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{prescription.customerName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{prescription.customerPhone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Customer ID:</span>
              <span className="detail-value">CUST{String(prescription.customerId).padStart(4, '0')}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4>Doctor Information</h4>
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{prescription.doctorName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Registration No:</span>
              <span className="detail-value">{prescription.doctorRegNo}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Specialization:</span>
              <span className="detail-value">{prescription.doctorSpecialization}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4>Prescription Information</h4>
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">Upload Date:</span>
              <span className="detail-value">{format(new Date(prescription.uploadDate), 'dd/MM/yyyy HH:mm')}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Validity Period:</span>
              <span className="detail-value">{prescription.validityDays} days</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Expiry Date:</span>
              <span className="detail-value" style={{ color: expiryStatus.color }}>
                {format(new Date(prescription.expiryDate), 'dd/MM/yyyy')} ({expiryStatus.text})
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4>File Information</h4>
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">File Name:</span>
              <span className="detail-value">{prescription.fileName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">File Size:</span>
              <span className="detail-value">{prescription.fileSize} KB</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">File Type:</span>
              <span className="detail-value">{prescription.fileType}</span>
            </div>
          </div>
        </div>
      </div>

      {prescription.notes && (
        <div className="prescription-notes">
          <h4>Notes</h4>
          <p>{prescription.notes}</p>
        </div>
      )}

      <div className="file-preview-section">
        <h4>Prescription File</h4>
        <div className="file-preview-card">
          <div className="file-icon">
            <FileText size={48} />
          </div>
          <div className="file-info">
            <div className="file-name">{prescription.fileName}</div>
            <div className="file-size">{prescription.fileSize} KB</div>
          </div>
          <div className="file-actions">
            <button className="btn btn-outline">
              <Download size={16} />
              Download
            </button>
            <button className="btn btn-primary">
              View Full Size
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicines = () => (
    <div className="prescription-medicines-detail">
      <div className="medicines-header">
        <h4>Prescribed Medicines ({prescription.medicines.length} items)</h4>
        <div className="fulfillment-summary">
          <div className="progress-info">
            <span>Fulfillment Progress: {fulfillmentProgress}%</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${fulfillmentProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="medicines-list">
        {prescription.medicines.map((medicine) => (
          <div key={medicine.id} className={`medicine-detail-card ${medicine.fulfilled ? 'fulfilled' : 'pending'}`}>
            <div className="medicine-header">
              <div className="medicine-info">
                <h5>{medicine.name}</h5>
                <p className="medicine-dosage">{medicine.dosage}</p>
              </div>
              <div className="medicine-status">
                <span className={`medicine-schedule ${medicine.scheduleType.toLowerCase()}`}>
                  {medicine.scheduleType}
                </span>
                {medicine.fulfilled ? (
                  <span className="fulfillment-badge fulfilled">
                    <CheckCircle size={14} />
                    Fulfilled
                  </span>
                ) : (
                  <span className="fulfillment-badge pending">
                    <Clock size={14} />
                    Pending
                  </span>
                )}
              </div>
            </div>

            <div className="medicine-details">
              <div className="detail-row">
                <span className="detail-label">Prescribed Quantity:</span>
                <span className="detail-value">{medicine.quantity}</span>
              </div>
              {medicine.fulfilled && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Fulfilled Quantity:</span>
                    <span className="detail-value">{medicine.fulfilledQuantity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Fulfillment Date:</span>
                    <span className="detail-value">
                      {format(new Date(medicine.fulfilledDate), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                </>
              )}
              <div className="detail-row">
                <span className="detail-label">Stock Status:</span>
                <span className={`detail-value ${medicine.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {!medicine.fulfilled && medicine.inStock && (
              <div className="medicine-actions">
                <button className="btn btn-primary btn-small">
                  Fulfill Now
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {prescription.hasRestrictedMedicines && (
        <div className="compliance-notice">
          <AlertTriangle size={16} />
          <span>This prescription contains restricted medicines requiring special handling and documentation.</span>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="prescription-history">
      <div className="validation-history">
        <h4>Validation History</h4>
        <div className="history-item">
          <div className="history-icon">
            {getValidationIcon()}
          </div>
          <div className="history-content">
            <div className="history-action">
              Prescription {prescription.validationStatus}
            </div>
            {prescription.validatedBy && (
              <div className="history-user">by {prescription.validatedBy}</div>
            )}
            {prescription.validationDate && (
              <div className="history-date">
                {format(new Date(prescription.validationDate), 'dd/MM/yyyy HH:mm')}
              </div>
            )}
            {prescription.validationNotes && (
              <div className="history-notes">{prescription.validationNotes}</div>
            )}
          </div>
        </div>
      </div>

      <div className="fulfillment-history">
        <h4>Fulfillment History</h4>
        {prescription.medicines.filter(med => med.fulfilled).map((medicine) => (
          <div key={medicine.id} className="history-item">
            <div className="history-icon">
              <CheckCircle size={16} style={{ color: '#10b981' }} />
            </div>
            <div className="history-content">
              <div className="history-action">
                {medicine.name} dispensed
              </div>
              <div className="history-details">
                Quantity: {medicine.fulfilledQuantity}
              </div>
              <div className="history-date">
                {format(new Date(medicine.fulfilledDate), 'dd/MM/yyyy HH:mm')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {prescription.linkedInvoices && prescription.linkedInvoices.length > 0 && (
        <div className="linked-invoices-history">
          <h4>Linked Invoices</h4>
          {prescription.linkedInvoices.map((invoiceId, index) => (
            <div key={index} className="history-item">
              <div className="history-icon">
                <FileText size={16} style={{ color: '#2563eb' }} />
              </div>
              <div className="history-content">
                <div className="history-action">Invoice generated</div>
                <div className="history-details">Invoice ID: {invoiceId}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="audit-trail">
        <h4>Audit Trail</h4>
        <div className="history-item">
          <div className="history-icon">
            <FileText size={16} style={{ color: '#6b7280' }} />
          </div>
          <div className="history-content">
            <div className="history-action">Prescription uploaded</div>
            <div className="history-user">by {prescription.createdBy}</div>
            <div className="history-date">
              {format(new Date(prescription.uploadDate), 'dd/MM/yyyy HH:mm')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="prescription-container">
      {/* Header */}
      <div className="prescription-detail-header">
        <button className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to List
        </button>
        
        <div className="prescription-title">
          <h2>Prescription {prescription.id}</h2>
          <div className="prescription-status-summary">
            <span className={`validation-badge ${prescription.validationStatus}`}>
              {getValidationIcon()}
              {prescription.validationStatus}
            </span>
            <span className={`fulfillment-badge ${prescription.fulfillmentStatus}`}>
              {prescription.fulfillmentStatus}
            </span>
            <span className={`expiry-badge ${expiryStatus.status}`}>
              {expiryStatus.text}
            </span>
          </div>
        </div>

        <div className="detail-actions">
          <button className="btn btn-outline">
            <Download size={16} />
            Download
          </button>
          <button className="btn btn-primary" onClick={onEdit}>
            <Edit size={16} />
            Edit
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="detail-sections">
        {sections.map((section) => {
          const IconComponent = section.icon;
          return (
            <button
              key={section.id}
              className={`section-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <IconComponent size={16} />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <div className="detail-content">
        {activeSection === 'details' && renderDetails()}
        {activeSection === 'medicines' && renderMedicines()}
        {activeSection === 'history' && renderHistory()}
      </div>
    </div>
  );
};

export default PrescriptionDetail;
