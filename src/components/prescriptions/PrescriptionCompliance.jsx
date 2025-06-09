import { useState } from 'react';
import { Shield, Download, AlertTriangle, CheckCircle, FileText, Calendar, Search } from 'lucide-react';
import { format, subDays, subYears } from 'date-fns';
import { usePrescriptions } from '../../contexts/PrescriptionContext';

const PrescriptionCompliance = () => {
  const { getFilteredPrescriptions } = usePrescriptions();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState({ start: subDays(new Date(), 30), end: new Date() });

  const prescriptions = getFilteredPrescriptions();

  // Compliance metrics
  const complianceMetrics = {
    totalRecords: prescriptions.length,
    retentionCompliant: prescriptions.filter(p => new Date(p.uploadDate) >= subYears(new Date(), 2)).length,
    restrictedMedicines: prescriptions.filter(p => p.hasRestrictedMedicines).length,
    validatedPrescriptions: prescriptions.filter(p => p.validationStatus === 'approved').length,
    doctorVerification: prescriptions.filter(p => p.doctorRegNo).length
  };

  const restrictedMedicineTypes = [
    { type: 'Schedule H', count: 85, description: 'Prescription required medicines' },
    { type: 'Schedule H1', count: 32, description: 'Habit forming medicines' },
    { type: 'Schedule X', count: 10, description: 'Narcotic and psychotropic substances' }
  ];

  const auditTrail = [
    {
      id: 1,
      action: 'Prescription Uploaded',
      user: 'Staff User',
      timestamp: new Date(),
      details: 'RX0001 uploaded for Rajesh Kumar'
    },
    {
      id: 2,
      action: 'Prescription Validated',
      user: 'Dr. Sathya',
      timestamp: subDays(new Date(), 1),
      details: 'RX0001 approved after verification'
    },
    {
      id: 3,
      action: 'Medicine Dispensed',
      user: 'Pharmacist',
      timestamp: subDays(new Date(), 1),
      details: 'Paracetamol 500mg dispensed from RX0001'
    }
  ];

  const exportOptions = [
    {
      id: 'audit-log',
      title: 'Audit Log Export',
      description: 'Complete audit trail for regulatory inspection',
      format: 'PDF/Excel'
    },
    {
      id: 'restricted-medicines',
      title: 'Restricted Medicines Report',
      description: 'Schedule H, H1, X medicines dispensing log',
      format: 'PDF/Excel'
    },
    {
      id: 'doctor-verification',
      title: 'Doctor Verification Report',
      description: 'Prescribing doctor registration verification',
      format: 'PDF'
    },
    {
      id: 'retention-report',
      title: 'Record Retention Report',
      description: 'Prescription storage compliance report',
      format: 'PDF'
    }
  ];

  const renderOverview = () => (
    <div className="compliance-overview">
      <div className="compliance-stats">
        <div className="stat-card success">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{Math.round((complianceMetrics.validatedPrescriptions / complianceMetrics.totalRecords) * 100)}%</div>
            <div className="stat-label">Validation Compliance</div>
            <div className="stat-detail">{complianceMetrics.validatedPrescriptions} of {complianceMetrics.totalRecords} validated</div>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{complianceMetrics.restrictedMedicines}</div>
            <div className="stat-label">Restricted Medicines</div>
            <div className="stat-detail">Requiring special handling</div>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{Math.round((complianceMetrics.retentionCompliant / complianceMetrics.totalRecords) * 100)}%</div>
            <div className="stat-label">Retention Compliance</div>
            <div className="stat-detail">Records within 2-year requirement</div>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{Math.round((complianceMetrics.doctorVerification / complianceMetrics.totalRecords) * 100)}%</div>
            <div className="stat-label">Doctor Verification</div>
            <div className="stat-detail">Valid registration numbers</div>
          </div>
        </div>
      </div>

      <div className="compliance-alerts">
        <h4>Compliance Alerts</h4>
        <div className="alert-list">
          <div className="compliance-alert success">
            <CheckCircle size={16} />
            <span>All restricted medicines properly documented</span>
          </div>
          <div className="compliance-alert success">
            <CheckCircle size={16} />
            <span>Doctor registration verification up to date</span>
          </div>
          <div className="compliance-alert warning">
            <AlertTriangle size={16} />
            <span>3 prescriptions nearing 2-year retention limit</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRestrictedMedicines = () => (
    <div className="restricted-medicines">
      <h4>Restricted Medicines Tracking</h4>
      <div className="restricted-summary">
        {restrictedMedicineTypes.map((type) => (
          <div key={type.type} className="restricted-card">
            <div className="restricted-header">
              <h5>{type.type}</h5>
              <span className="restricted-count">{type.count} prescriptions</span>
            </div>
            <p>{type.description}</p>
          </div>
        ))}
      </div>

      <div className="restricted-table">
        <h5>Recent Restricted Medicine Dispensing</h5>
        <table className="compliance-table">
          <thead>
            <tr>
              <th>Prescription ID</th>
              <th>Medicine</th>
              <th>Schedule</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date Dispensed</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>RX0001</td>
              <td>Alprazolam 0.5mg</td>
              <td>H1</td>
              <td>Rajesh Kumar</td>
              <td>Dr. Sharma (MH12345)</td>
              <td>{format(new Date(), 'dd/MM/yyyy')}</td>
              <td>30 tablets</td>
            </tr>
            <tr>
              <td>RX0003</td>
              <td>Morphine 10mg</td>
              <td>X</td>
              <td>Priya Sharma</td>
              <td>Dr. Patel (MH12346)</td>
              <td>{format(subDays(new Date(), 1), 'dd/MM/yyyy')}</td>
              <td>10 tablets</td>
            </tr>
            <tr>
              <td>RX0005</td>
              <td>Amoxicillin 250mg</td>
              <td>H</td>
              <td>Amit Patel</td>
              <td>Dr. Singh (MH12347)</td>
              <td>{format(subDays(new Date(), 2), 'dd/MM/yyyy')}</td>
              <td>21 capsules</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAuditTrail = () => (
    <div className="audit-trail">
      <div className="audit-header">
        <h4>Audit Trail</h4>
        <div className="audit-filters">
          <input
            type="date"
            value={format(dateRange.start, 'yyyy-MM-dd')}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
            className="filter-select"
          />
          <input
            type="date"
            value={format(dateRange.end, 'yyyy-MM-dd')}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
            className="filter-select"
          />
          <button className="btn btn-outline">
            <Search size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="audit-list">
        {auditTrail.map((entry) => (
          <div key={entry.id} className="audit-entry">
            <div className="audit-timestamp">
              <Calendar size={14} />
              {format(new Date(entry.timestamp), 'dd/MM/yyyy HH:mm')}
            </div>
            <div className="audit-content">
              <div className="audit-action">{entry.action}</div>
              <div className="audit-user">by {entry.user}</div>
              <div className="audit-details">{entry.details}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExports = () => (
    <div className="compliance-exports">
      <h4>Compliance Reports & Exports</h4>
      <div className="export-grid">
        {exportOptions.map((option) => (
          <div key={option.id} className="export-card">
            <div className="export-icon">
              <Download size={24} />
            </div>
            <div className="export-content">
              <h5>{option.title}</h5>
              <p>{option.description}</p>
              <div className="export-format">Format: {option.format}</div>
            </div>
            <button className="btn btn-primary">
              <Download size={16} />
              Export
            </button>
          </div>
        ))}
      </div>

      <div className="export-schedule">
        <h5>Automated Report Schedule</h5>
        <div className="schedule-options">
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span className="checkmark"></span>
            Weekly compliance summary
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span className="checkmark"></span>
            Monthly restricted medicines report
          </label>
          <label className="checkbox-label">
            <input type="checkbox" />
            <span className="checkmark"></span>
            Quarterly audit trail export
          </label>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'restricted', label: 'Restricted Medicines', icon: AlertTriangle },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
    { id: 'exports', label: 'Reports & Exports', icon: Download }
  ];

  return (
    <div className="prescription-container">
      <div className="prescription-section">
        <h3>Compliance & Recordkeeping</h3>
        <p>Regulatory compliance monitoring and audit trail management</p>
      </div>

      {/* Compliance Tabs */}
      <div className="compliance-tabs">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${selectedReport === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedReport(tab.id)}
            >
              <IconComponent size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="compliance-content">
        {selectedReport === 'overview' && renderOverview()}
        {selectedReport === 'restricted' && renderRestrictedMedicines()}
        {selectedReport === 'audit' && renderAuditTrail()}
        {selectedReport === 'exports' && renderExports()}
      </div>

      {/* Compliance Footer */}
      <div className="compliance-footer">
        <div className="compliance-info">
          <p>
            <strong>Regulatory Compliance:</strong> This system maintains records in accordance with 
            Drug Control Authority requirements and ensures proper handling of restricted medicines.
          </p>
          <p>
            <strong>Data Retention:</strong> All prescription records are automatically retained for 
            a minimum of 2 years as required by law.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCompliance;
