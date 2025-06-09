import { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, User, Calendar, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { usePrescriptions } from '../../contexts/PrescriptionContext';

const PrescriptionList = ({ onPrescriptionSelect }) => {
  const { 
    getFilteredPrescriptions, 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters, 
    loading,
    updatePrescription 
  } = usePrescriptions();

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPrescriptions = getFilteredPrescriptions();
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getValidationIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="validation-icon approved" />;
      case 'rejected':
        return <AlertTriangle size={16} className="validation-icon rejected" />;
      default:
        return <Clock size={16} className="validation-icon pending" />;
    }
  };

  const getFulfillmentIcon = (status) => {
    switch (status) {
      case 'fulfilled':
        return <CheckCircle size={16} className="fulfillment-icon fulfilled" />;
      case 'partial':
        return <Clock size={16} className="fulfillment-icon partial" />;
      default:
        return <Clock size={16} className="fulfillment-icon pending" />;
    }
  };

  const getExpiryStatus = (prescription) => {
    if (prescription.isExpired) {
      return { status: 'expired', text: 'Expired', icon: AlertTriangle };
    } else if (prescription.daysToExpiry <= 7) {
      return { status: 'expiring', text: `${prescription.daysToExpiry} days left`, icon: Clock };
    } else {
      return { status: 'valid', text: `${prescription.daysToExpiry} days left`, icon: CheckCircle };
    }
  };

  const getScheduleTypes = (medicines) => {
    const types = [...new Set(medicines.map(med => med.scheduleType))];
    return types.sort();
  };

  if (loading) {
    return (
      <div className="prescription-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prescription-container">
      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer, doctor, medicine, or prescription ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <button 
          className={`btn btn-outline ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="prescription-section">
          <h4>Filter Prescriptions</h4>
          <div className="form-grid">
            <div className="filter-group">
              <label>Validation Status</label>
              <select
                value={filters.validationStatus}
                onChange={(e) => handleFilterChange('validationStatus', e.target.value)}
                className="filter-select"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Fulfillment Status</label>
              <select
                value={filters.fulfillmentStatus}
                onChange={(e) => handleFilterChange('fulfillmentStatus', e.target.value)}
                className="filter-select"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Expiry Status</label>
              <select
                value={filters.expiryStatus}
                onChange={(e) => handleFilterChange('expiryStatus', e.target.value)}
                className="filter-select"
              >
                <option value="">All Prescriptions</option>
                <option value="valid">Valid</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Schedule Type</label>
              <select
                value={filters.scheduleType}
                onChange={(e) => handleFilterChange('scheduleType', e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                <option value="OTC">OTC</option>
                <option value="H">Schedule H</option>
                <option value="H1">Schedule H1</option>
                <option value="X">Schedule X</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Doctor Name</label>
              <input
                type="text"
                value={filters.doctorName}
                onChange={(e) => handleFilterChange('doctorName', e.target.value)}
                className="filter-select"
                placeholder="Enter doctor name"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {paginatedPrescriptions.length} of {filteredPrescriptions.length} prescriptions</p>
      </div>

      {/* Prescription List */}
      <div className="prescription-list">
        {paginatedPrescriptions.map((prescription) => {
          const expiryStatus = getExpiryStatus(prescription);
          const scheduleTypes = getScheduleTypes(prescription.medicines);
          
          return (
            <div 
              key={prescription.id} 
              className={`prescription-card ${prescription.validationStatus} ${expiryStatus.status}`}
              onClick={() => onPrescriptionSelect(prescription)}
            >
              <div className="prescription-card-header">
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
                    <span>({prescription.doctorSpecialization})</span>
                  </div>
                </div>
                
                <div className="prescription-status-group">
                  <div className={`validation-badge ${prescription.validationStatus}`}>
                    {getValidationIcon(prescription.validationStatus)}
                    {prescription.validationStatus}
                  </div>
                  <div className={`fulfillment-badge ${prescription.fulfillmentStatus}`}>
                    {getFulfillmentIcon(prescription.fulfillmentStatus)}
                    {prescription.fulfillmentStatus}
                  </div>
                  <div className={`expiry-badge ${expiryStatus.status}`}>
                    <expiryStatus.icon size={14} />
                    {expiryStatus.text}
                  </div>
                </div>
              </div>

              <div className="prescription-meta">
                <div className="meta-item">
                  <span className="meta-label">Upload Date</span>
                  <span className="meta-value">{format(new Date(prescription.uploadDate), 'dd/MM/yyyy')}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Validity</span>
                  <span className="meta-value">{prescription.validityDays} days</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">File Type</span>
                  <span className="meta-value">{prescription.fileName.split('.').pop().toUpperCase()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Medicines</span>
                  <span className="meta-value">{prescription.medicines.length} items</span>
                </div>
              </div>

              <div className="prescription-medicines">
                <h5>Prescribed Medicines</h5>
                <div className="medicine-list">
                  {prescription.medicines.slice(0, 3).map((medicine) => (
                    <div key={medicine.id} className="medicine-item">
                      <div>
                        <div className="medicine-name">{medicine.name}</div>
                        <div className="medicine-dosage">{medicine.dosage}</div>
                      </div>
                      <div className="medicine-badges">
                        <span className={`medicine-schedule ${medicine.scheduleType.toLowerCase()}`}>
                          {medicine.scheduleType}
                        </span>
                        {!medicine.inStock && (
                          <span className="stock-badge out-of-stock">Out of Stock</span>
                        )}
                        {medicine.fulfilled && (
                          <span className="fulfillment-badge fulfilled">✓ Fulfilled</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {prescription.medicines.length > 3 && (
                    <div className="medicine-item">
                      <span className="more-medicines">
                        +{prescription.medicines.length - 3} more medicines
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {prescription.hasRestrictedMedicines && (
                <div className="compliance-alert">
                  <AlertTriangle size={16} />
                  <span>Contains restricted medicines - Prescription required</span>
                </div>
              )}

              <div className="prescription-actions" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="btn-icon"
                  onClick={() => onPrescriptionSelect(prescription)}
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button 
                  className="btn-icon"
                  title="Edit Prescription"
                >
                  <Edit size={16} />
                </button>
                {prescription.validationStatus === 'pending' && (
                  <button 
                    className="btn btn-primary btn-small"
                    title="Validate"
                  >
                    Validate
                  </button>
                )}
                {prescription.validationStatus === 'approved' && prescription.fulfillmentStatus !== 'fulfilled' && (
                  <button 
                    className="btn btn-secondary btn-small"
                    title="Fulfill"
                  >
                    Fulfill
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn btn-outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="btn btn-outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredPrescriptions.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={48} />
          </div>
          <h3>No prescriptions found</h3>
          <p>Try adjusting your search criteria or filters</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSearchTerm('');
              setFilters({
                validationStatus: '',
                fulfillmentStatus: '',
                expiryStatus: '',
                scheduleType: '',
                doctorName: '',
                dateRange: ''
              });
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;
