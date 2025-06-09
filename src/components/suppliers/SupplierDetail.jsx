import { useState } from 'react';
import { ArrowLeft, Edit, Phone, Mail, MapPin, CreditCard, Star, TrendingUp, Package } from 'lucide-react';
import { format } from 'date-fns';

const SupplierDetail = ({ supplier, onBack, onEdit }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} fill="currentColor" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} fill="currentColor" style={{ opacity: 0.5 }} />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} />);
    }
    
    return stars;
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'financial', label: 'Financial', icon: CreditCard }
  ];

  const renderOverview = () => (
    <div className="supplier-details">
      <div className="details-grid">
        <div className="detail-section">
          <h4>Basic Information</h4>
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">Supplier Name:</span>
              <span className="detail-value">{supplier.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{supplier.supplierType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Contact Person:</span>
              <span className="detail-value">{supplier.contactPerson}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Registration Date:</span>
              <span className="detail-value">{format(new Date(supplier.registrationDate), 'dd/MM/yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4>Contact Information</h4>
          <div className="detail-list">
            <div className="detail-item">
              <Phone size={16} />
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{supplier.phone}</span>
            </div>
            <div className="detail-item">
              <Mail size={16} />
              <span className="detail-label">Email:</span>
              <span className="detail-value">{supplier.email}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4>Legal Information</h4>
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">GSTIN:</span>
              <span className="detail-value">{supplier.gstin}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">PAN Number:</span>
              <span className="detail-value">{supplier.panNumber}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4>Business Terms</h4>
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">Payment Terms:</span>
              <span className="detail-value">{supplier.paymentTerms}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Delivery Time:</span>
              <span className="detail-value">{supplier.deliveryTime} days</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Rating:</span>
              <span className="detail-value rating">
                {getRatingStars(supplier.rating)}
                <span>{supplier.rating}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="address-section">
        <div className="address-card">
          <h4>Billing Address</h4>
          <div className="address-content">
            <MapPin size={16} />
            <p>{supplier.billingAddress}</p>
          </div>
        </div>
        
        <div className="address-card">
          <h4>Shipping Address</h4>
          <div className="address-content">
            <MapPin size={16} />
            <p>{supplier.shippingAddress}</p>
          </div>
        </div>
      </div>

      {supplier.bankAccount.accountNumber && (
        <div className="bank-details">
          <h4>Bank Account Details</h4>
          <div className="bank-info">
            <div className="bank-item">
              <span className="bank-label">Account Number:</span>
              <span className="bank-value">{supplier.bankAccount.accountNumber}</span>
            </div>
            <div className="bank-item">
              <span className="bank-label">IFSC Code:</span>
              <span className="bank-value">{supplier.bankAccount.ifscCode}</span>
            </div>
            <div className="bank-item">
              <span className="bank-label">Bank Name:</span>
              <span className="bank-value">{supplier.bankAccount.bankName}</span>
            </div>
            <div className="bank-item">
              <span className="bank-label">Account Holder:</span>
              <span className="bank-value">{supplier.bankAccount.accountHolder}</span>
            </div>
          </div>
        </div>
      )}

      {supplier.notes && (
        <div className="supplier-notes">
          <h4>Notes</h4>
          <p>{supplier.notes}</p>
        </div>
      )}
    </div>
  );

  const renderPerformance = () => (
    <div className="performance-details">
      <div className="performance-metrics">
        <div className="metric-card">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{supplier.onTimeDeliveryRate}%</div>
            <div className="metric-label">On-time Delivery Rate</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <Package size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{supplier.returnRate}%</div>
            <div className="metric-label">Return Rate</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <Star size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{supplier.rating}</div>
            <div className="metric-label">Overall Rating</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <Package size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{supplier.averageDeliveryTime}</div>
            <div className="metric-label">Avg Delivery (days)</div>
          </div>
        </div>
      </div>

      <div className="performance-history">
        <h4>Performance History</h4>
        <div className="history-timeline">
          <div className="timeline-item">
            <div className="timeline-date">Last 30 days</div>
            <div className="timeline-content">
              <div className="timeline-metric">
                <span>On-time Deliveries:</span>
                <span className="metric-good">95%</span>
              </div>
              <div className="timeline-metric">
                <span>Quality Score:</span>
                <span className="metric-excellent">4.8/5</span>
              </div>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-date">Last 90 days</div>
            <div className="timeline-content">
              <div className="timeline-metric">
                <span>On-time Deliveries:</span>
                <span className="metric-good">92%</span>
              </div>
              <div className="timeline-metric">
                <span>Quality Score:</span>
                <span className="metric-good">4.6/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancial = () => (
    <div className="financial-details">
      <div className="financial-summary">
        <div className="financial-card">
          <h4>Purchase Summary</h4>
          <div className="financial-metrics">
            <div className="financial-item">
              <span className="financial-label">Total Purchases:</span>
              <span className="financial-value">{formatCurrency(supplier.totalPurchases)}</span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Total Orders:</span>
              <span className="financial-value">{supplier.totalOrders}</span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Average Order Value:</span>
              <span className="financial-value">{formatCurrency(supplier.totalPurchases / supplier.totalOrders)}</span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Last Order Date:</span>
              <span className="financial-value">{format(new Date(supplier.lastOrderDate), 'dd/MM/yyyy')}</span>
            </div>
          </div>
        </div>
        
        <div className="financial-card">
          <h4>Outstanding Dues</h4>
          <div className="financial-metrics">
            <div className="financial-item">
              <span className="financial-label">Outstanding Amount:</span>
              <span className="financial-value outstanding">{formatCurrency(supplier.outstandingAmount)}</span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Payment Terms:</span>
              <span className="financial-value">{supplier.paymentTerms}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="payment-history">
        <h4>Recent Payment History</h4>
        <div className="payment-timeline">
          <div className="payment-item">
            <div className="payment-date">15/01/2024</div>
            <div className="payment-details">
              <span>Payment received: {formatCurrency(45000)}</span>
              <span className="payment-mode">Bank Transfer</span>
            </div>
          </div>
          
          <div className="payment-item">
            <div className="payment-date">28/12/2023</div>
            <div className="payment-details">
              <span>Payment received: {formatCurrency(32000)}</span>
              <span className="payment-mode">Cheque</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="supplier-container">
      {/* Header */}
      <div className="supplier-detail-header">
        <button className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to List
        </button>
        
        <div className="supplier-title">
          <h2>{supplier.name}</h2>
          <div className="supplier-meta">
            <span className={`supplier-type ${supplier.supplierType.toLowerCase()}`}>
              {supplier.supplierType}
            </span>
            <span className={`status-badge ${supplier.status}`}>
              {supplier.status}
            </span>
            <div className="rating-display">
              {getRatingStars(supplier.rating)}
              <span>{supplier.rating}</span>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <button className="btn btn-primary" onClick={onEdit}>
            <Edit size={16} />
            Edit Supplier
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
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'performance' && renderPerformance()}
        {activeSection === 'financial' && renderFinancial()}
      </div>
    </div>
  );
};

export default SupplierDetail;
