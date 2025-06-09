import { useState } from 'react';
import { Package, CheckCircle, Clock, AlertTriangle, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { usePrescriptions } from '../../contexts/PrescriptionContext';

const PrescriptionFulfillment = () => {
  const { getFilteredPrescriptions, updateFulfillment, loading } = usePrescriptions();
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [fulfillmentData, setFulfillmentData] = useState({});

  // Get approved prescriptions that need fulfillment
  const approvedPrescriptions = getFilteredPrescriptions().filter(p => 
    p.validationStatus === 'approved' && p.fulfillmentStatus !== 'fulfilled'
  );

  const handleFulfillmentChange = (medicineId, quantity) => {
    setFulfillmentData(prev => ({
      ...prev,
      [medicineId]: parseInt(quantity) || 0
    }));
  };

  const handleFulfillMedicine = (prescriptionId, medicineId) => {
    const quantity = fulfillmentData[medicineId] || 0;
    if (quantity > 0) {
      const invoiceId = `INV${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      updateFulfillment(prescriptionId, medicineId, quantity, invoiceId);
      setFulfillmentData(prev => ({ ...prev, [medicineId]: 0 }));
    }
  };

  const calculateProgress = (prescription) => {
    const totalMedicines = prescription.medicines.length;
    const fulfilledMedicines = prescription.medicines.filter(med => med.fulfilled).length;
    return Math.round((fulfilledMedicines / totalMedicines) * 100);
  };

  const getAvailableStock = (medicineName) => {
    // Mock stock data
    const stockData = {
      'Paracetamol 500mg': 150,
      'Amoxicillin 250mg': 75,
      'Insulin Pen': 0,
      'Metformin 500mg': 200,
      'Atorvastatin 10mg': 120,
      'Alprazolam 0.5mg': 50,
      'Morphine 10mg': 0
    };
    return stockData[medicineName] || Math.floor(Math.random() * 100);
  };

  if (loading) {
    return (
      <div className="prescription-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading fulfillment queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prescription-container">
      <div className="prescription-section">
        <h3>Prescription Fulfillment ({approvedPrescriptions.length} pending)</h3>
        <p>Fulfill approved prescriptions and track medicine dispensing</p>
      </div>

      <div className="fulfillment-container">
        {approvedPrescriptions.map((prescription) => {
          const progress = calculateProgress(prescription);
          const pendingMedicines = prescription.medicines.filter(med => !med.fulfilled);
          
          return (
            <div key={prescription.id} className="fulfillment-card">
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
                  </div>
                </div>
                
                <div className="fulfillment-status">
                  <div className={`fulfillment-badge ${prescription.fulfillmentStatus}`}>
                    {prescription.fulfillmentStatus === 'fulfilled' ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                    {prescription.fulfillmentStatus}
                  </div>
                </div>
              </div>

              <div className="fulfillment-progress">
                <div className="progress-header">
                  <span>Fulfillment Progress</span>
                  <span>{progress}% Complete</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {prescription.medicines.filter(med => med.fulfilled).length} of {prescription.medicines.length} medicines fulfilled
                </div>
              </div>

              <div className="medicine-fulfillment-list">
                <h5>Medicines to Fulfill</h5>
                {prescription.medicines.map((medicine) => {
                  const availableStock = getAvailableStock(medicine.name);
                  const maxFulfillable = Math.min(medicine.quantity, availableStock);
                  
                  return (
                    <div key={medicine.id} className="medicine-fulfillment">
                      <div className="medicine-info">
                        <div className="medicine-name">{medicine.name}</div>
                        <div className="medicine-details">
                          <span>Prescribed: {medicine.quantity}</span>
                          <span>Available: {availableStock}</span>
                          {medicine.fulfilled && (
                            <span className="fulfilled-info">
                              ✓ Fulfilled: {medicine.fulfilledQuantity} on {format(new Date(medicine.fulfilledDate), 'dd/MM/yyyy')}
                            </span>
                          )}
                        </div>
                        <div className="medicine-dosage">{medicine.dosage}</div>
                      </div>
                      
                      <div className="medicine-badges">
                        <span className={`medicine-schedule ${medicine.scheduleType.toLowerCase()}`}>
                          {medicine.scheduleType}
                        </span>
                        {availableStock === 0 && (
                          <span className="stock-badge out-of-stock">Out of Stock</span>
                        )}
                        {medicine.fulfilled && (
                          <span className="fulfillment-badge fulfilled">✓ Fulfilled</span>
                        )}
                      </div>
                      
                      {!medicine.fulfilled && availableStock > 0 && (
                        <div className="fulfillment-controls">
                          <input
                            type="number"
                            min="0"
                            max={maxFulfillable}
                            value={fulfillmentData[medicine.id] || ''}
                            onChange={(e) => handleFulfillmentChange(medicine.id, e.target.value)}
                            className="fulfillment-input"
                            placeholder="Qty"
                          />
                          <button
                            className="btn btn-primary btn-small"
                            onClick={() => handleFulfillMedicine(prescription.id, medicine.id)}
                            disabled={!fulfillmentData[medicine.id] || fulfillmentData[medicine.id] <= 0}
                          >
                            <Package size={14} />
                            Fulfill
                          </button>
                        </div>
                      )}
                      
                      {!medicine.fulfilled && availableStock === 0 && (
                        <div className="stock-alert">
                          <AlertTriangle size={16} />
                          <span>Out of stock - Cannot fulfill</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {prescription.linkedInvoices && prescription.linkedInvoices.length > 0 && (
                <div className="linked-invoices">
                  <h5>Linked Invoices</h5>
                  <div className="invoice-list">
                    {prescription.linkedInvoices.map((invoiceId, index) => (
                      <span key={index} className="invoice-badge">
                        {invoiceId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {prescription.hasRestrictedMedicines && (
                <div className="compliance-alert">
                  <AlertTriangle size={16} />
                  <span>Contains restricted medicines - Ensure proper documentation</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {approvedPrescriptions.length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No prescriptions pending fulfillment</h3>
          <p>All approved prescriptions have been fulfilled</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="fulfillment-actions">
        <div className="action-card">
          <h4>Quick Actions</h4>
          <div className="action-buttons">
            <button className="btn btn-outline">
              <Package size={16} />
              Bulk Fulfill
            </button>
            <button className="btn btn-outline">
              <AlertTriangle size={16} />
              Stock Alerts
            </button>
            <button className="btn btn-outline">
              <FileText size={16} />
              Generate Report
            </button>
          </div>
        </div>
        
        <div className="fulfillment-stats">
          <div className="stat-item">
            <span className="stat-value">{approvedPrescriptions.length}</span>
            <span className="stat-label">Pending Fulfillment</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {approvedPrescriptions.reduce((sum, p) => sum + p.medicines.filter(m => !m.fulfilled).length, 0)}
            </span>
            <span className="stat-label">Medicines to Fulfill</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {approvedPrescriptions.reduce((sum, p) => sum + p.medicines.filter(m => !getAvailableStock(m.name)).length, 0)}
            </span>
            <span className="stat-label">Out of Stock</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionFulfillment;
