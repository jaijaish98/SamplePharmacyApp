import { useState } from 'react';
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, Gift, FileText, MessageSquare, Download } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useCustomers } from '../../contexts/CustomerContext';

const CustomerProfile = ({ customer, onBack, onEdit }) => {
  const { getCustomerPurchaseHistory, getCustomerPrescriptions, getCustomerFeedback } = useCustomers();
  const [activeSection, setActiveSection] = useState('overview');

  const purchaseHistory = getCustomerPurchaseHistory(customer.id);
  const prescriptions = getCustomerPrescriptions(customer.id);
  const feedback = getCustomerFeedback(customer.id);

  const getLoyaltyTier = (points) => {
    if (points >= 3000) return { tier: 'gold', label: 'Gold Member' };
    if (points >= 1000) return { tier: 'silver', label: 'Silver Member' };
    return { tier: 'bronze', label: 'Bronze Member' };
  };

  const getCustomerInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const loyaltyTier = getLoyaltyTier(customer.loyaltyPoints);
  const daysSinceLastVisit = differenceInDays(new Date(), new Date(customer.lastVisit));

  const sections = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'purchases', label: 'Purchase History', icon: FileText },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare }
  ];

  const renderOverview = () => (
    <div className="profile-overview">
      <div className="overview-grid">
        <div className="overview-card">
          <h4>Contact Information</h4>
          <div className="info-list">
            <div className="info-item">
              <Phone size={16} />
              <span>{customer.phone}</span>
              {customer.mobileVerified && <span className="verification-badge verified">✓</span>}
            </div>
            {customer.email && (
              <div className="info-item">
                <Mail size={16} />
                <span>{customer.email}</span>
                {customer.emailVerified && <span className="verification-badge verified">✓</span>}
              </div>
            )}
            {customer.address && (
              <div className="info-item">
                <MapPin size={16} />
                <span>{customer.address}</span>
              </div>
            )}
            {customer.emergencyContact && (
              <div className="info-item">
                <Phone size={16} />
                <span>Emergency: {customer.emergencyContact}</span>
              </div>
            )}
          </div>
        </div>

        <div className="overview-card">
          <h4>Medical Information</h4>
          <div className="medical-info">
            {customer.allergies.length > 0 && (
              <div className="medical-section">
                <strong>Allergies:</strong>
                <div className="medical-tags">
                  {customer.allergies.map((allergy, index) => (
                    <span key={index} className="medical-tag allergy">{allergy}</span>
                  ))}
                </div>
              </div>
            )}
            {customer.chronicConditions.length > 0 && (
              <div className="medical-section">
                <strong>Chronic Conditions:</strong>
                <div className="medical-tags">
                  {customer.chronicConditions.map((condition, index) => (
                    <span key={index} className="medical-tag condition">{condition}</span>
                  ))}
                </div>
              </div>
            )}
            {customer.notes && (
              <div className="medical-section">
                <strong>Notes:</strong>
                <p>{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="overview-card">
          <h4>Purchase Summary</h4>
          <div className="purchase-stats">
            <div className="stat">
              <span className="stat-value">{customer.totalPurchases}</span>
              <span className="stat-label">Total Purchases</span>
            </div>
            <div className="stat">
              <span className="stat-value">₹{customer.totalSpent.toLocaleString()}</span>
              <span className="stat-label">Total Spent</span>
            </div>
            <div className="stat">
              <span className="stat-value">₹{Math.round(customer.totalSpent / customer.totalPurchases)}</span>
              <span className="stat-label">Avg Order Value</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h4>Loyalty Information</h4>
          <div className="loyalty-info">
            <div className={`loyalty-tier ${loyaltyTier.tier}`}>
              <Gift size={20} />
              <span>{loyaltyTier.label}</span>
            </div>
            <div className="loyalty-points">
              <span className="points-value">{customer.loyaltyPoints}</span>
              <span className="points-label">Available Points</span>
            </div>
            <div className="loyalty-details">
              <p>Next tier: {loyaltyTier.tier === 'bronze' ? 'Silver (1000 pts)' : loyaltyTier.tier === 'silver' ? 'Gold (3000 pts)' : 'Maximum tier reached'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPurchases = () => (
    <div className="purchase-history">
      <div className="section-header">
        <h4>Purchase History ({purchaseHistory.length} transactions)</h4>
        <button className="btn btn-outline">
          <Download size={16} />
          Export
        </button>
      </div>
      <div className="purchase-list">
        {purchaseHistory.map((purchase) => (
          <div key={purchase.id} className="purchase-card">
            <div className="purchase-header">
              <div className="purchase-info">
                <span className="invoice-no">{purchase.invoiceNo}</span>
                <span className="purchase-date">{format(new Date(purchase.date), 'dd/MM/yyyy')}</span>
              </div>
              <div className="purchase-amount">₹{purchase.total.toLocaleString()}</div>
            </div>
            <div className="purchase-items">
              {purchase.items.map((item, index) => (
                <div key={index} className="purchase-item">
                  <span className="item-name">{item.medicine}</span>
                  <span className="item-details">Qty: {item.quantity} × ₹{item.price}</span>
                </div>
              ))}
            </div>
            <div className="purchase-footer">
              <span className="payment-method">{purchase.paymentMethod}</span>
              {purchase.discount > 0 && <span className="discount">Discount: ₹{purchase.discount}</span>}
              <span className="loyalty-earned">+{purchase.loyaltyPointsEarned} points</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrescriptions = () => (
    <div className="prescriptions">
      <div className="section-header">
        <h4>Prescriptions ({prescriptions.length} uploaded)</h4>
        <button className="btn btn-primary">
          <FileText size={16} />
          Upload New
        </button>
      </div>
      <div className="prescription-list">
        {prescriptions.map((prescription) => (
          <div key={prescription.id} className="prescription-card">
            <div className="prescription-header">
              <div className="prescription-info">
                <span className="prescription-id">{prescription.id}</span>
                <span className="doctor-name">Dr. {prescription.doctorName}</span>
              </div>
              <span className={`prescription-status ${prescription.status}`}>
                {prescription.status}
              </span>
            </div>
            <div className="prescription-details">
              <div className="prescription-dates">
                <span>Uploaded: {format(new Date(prescription.uploadDate), 'dd/MM/yyyy')}</span>
                <span>Expires: {format(new Date(prescription.expiryDate), 'dd/MM/yyyy')}</span>
              </div>
              <div className="prescription-medicines">
                {prescription.medicines.map((medicine, index) => (
                  <span key={index} className="medicine-item">{medicine}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="feedback-history">
      <div className="section-header">
        <h4>Feedback & Complaints ({feedback.length} entries)</h4>
      </div>
      <div className="feedback-list">
        {feedback.map((item) => (
          <div key={item.id} className="feedback-card">
            <div className="feedback-header">
              <div className="feedback-info">
                <span className={`feedback-type ${item.type}`}>{item.type}</span>
                <span className="feedback-date">{format(new Date(item.date), 'dd/MM/yyyy')}</span>
              </div>
              <span className={`feedback-status ${item.status}`}>
                {item.status}
              </span>
            </div>
            <div className="feedback-content">
              <h5>{item.subject}</h5>
              <p>{item.description}</p>
              {item.resolution && (
                <div className="feedback-resolution">
                  <strong>Resolution:</strong> {item.resolution}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="customer-container">
      {/* Profile Header */}
      <div className="profile-header">
        <button className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to List
        </button>
        
        <div className="profile-info">
          <div className="profile-avatar">
            {getCustomerInitials(customer.name)}
          </div>
          <div className="profile-details">
            <h2>{customer.name}</h2>
            <div className="profile-meta">
              <span>{customer.age} years, {customer.gender}</span>
              <span>Customer ID: {customer.customerCode}</span>
              <span className={`status-badge ${customer.status}`}>{customer.status}</span>
              <span className={`loyalty-badge ${loyaltyTier.tier}`}>{loyaltyTier.label}</span>
            </div>
            <div className="profile-stats">
              <span>Last visit: {daysSinceLastVisit === 0 ? 'Today' : `${daysSinceLastVisit} days ago`}</span>
              <span>Member since: {format(new Date(customer.registrationDate), 'MMM yyyy')}</span>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onEdit}>
          <Edit size={16} />
          Edit Profile
        </button>
      </div>

      {/* Customer Tags */}
      {customer.tags.length > 0 && (
        <div className="profile-tags">
          {customer.tags.map((tag, index) => (
            <span key={index} className="customer-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Section Navigation */}
      <div className="profile-sections">
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
      <div className="profile-content">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'purchases' && renderPurchases()}
        {activeSection === 'prescriptions' && renderPrescriptions()}
        {activeSection === 'feedback' && renderFeedback()}
      </div>
    </div>
  );
};

export default CustomerProfile;
