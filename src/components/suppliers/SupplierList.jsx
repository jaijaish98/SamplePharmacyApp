import { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, User, Phone, Mail, Star, TrendingUp, Package } from 'lucide-react';
import { format } from 'date-fns';
import { useSuppliers } from '../../contexts/SupplierContext';

const SupplierList = ({ onSupplierSelect }) => {
  const { 
    getFilteredSuppliers, 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters, 
    loading,
    updateSupplier 
  } = useSuppliers();

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSuppliers = getFilteredSuppliers();
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getStatusIcon = (status) => {
    return status === 'active' ? 
      <div className="status-indicator active"></div> : 
      <div className="status-indicator inactive"></div>;
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={12} fill="currentColor" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={12} fill="currentColor" style={{ opacity: 0.5 }} />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={12} />);
    }
    
    return stars;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const toggleSupplierStatus = (supplierId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateSupplier(supplierId, { status: newStatus });
  };

  if (loading) {
    return (
      <div className="supplier-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading suppliers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-container">
      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by supplier name, contact person, phone, or email..."
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
        <div className="supplier-section">
          <h4>Filter Suppliers</h4>
          <div className="form-grid">
            <div className="filter-group">
              <label>Supplier Type</label>
              <select
                value={filters.supplierType}
                onChange={(e) => handleFilterChange('supplierType', e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                <option value="Wholesaler">Wholesaler</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Local">Local</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="filter-select"
              >
                <option value="">All Ratings</option>
                <option value="excellent">Excellent (4.5+)</option>
                <option value="good">Good (3.5-4.4)</option>
                <option value="average">Average (&lt;3.5)</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Payment Terms</label>
              <select
                value={filters.paymentTerms}
                onChange={(e) => handleFilterChange('paymentTerms', e.target.value)}
                className="filter-select"
              >
                <option value="">All Terms</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="COD">COD</option>
                <option value="Advance">Advance</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {paginatedSuppliers.length} of {filteredSuppliers.length} suppliers</p>
      </div>

      {/* Supplier List */}
      <div className="supplier-list">
        {paginatedSuppliers.map((supplier) => (
          <div 
            key={supplier.id} 
            className={`supplier-card ${supplier.status}`}
            onClick={() => onSupplierSelect(supplier)}
          >
            <div className="supplier-card-header">
              <div className="supplier-info">
                <div className="supplier-name">{supplier.name}</div>
                <div className="supplier-contact">
                  <User size={14} />
                  <span>{supplier.contactPerson}</span>
                </div>
                <div className="supplier-contact">
                  <Phone size={14} />
                  <span>{supplier.phone}</span>
                </div>
                <div className="supplier-contact">
                  <Mail size={14} />
                  <span>{supplier.email}</span>
                </div>
              </div>
              
              <div className="supplier-status-group">
                <span className={`supplier-type ${supplier.supplierType.toLowerCase()}`}>
                  {supplier.supplierType}
                </span>
                <div className={`status-badge ${supplier.status}`}>
                  {getStatusIcon(supplier.status)}
                  {supplier.status}
                </div>
                <div className="rating-badge">
                  {getRatingStars(supplier.rating)}
                  <span>{supplier.rating}</span>
                </div>
              </div>
            </div>

            <div className="supplier-meta">
              <div className="meta-item">
                <span className="meta-label">Payment Terms</span>
                <span className="meta-value">{supplier.paymentTerms}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Delivery Time</span>
                <span className="meta-value">{supplier.deliveryTime} days</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Total Purchases</span>
                <span className="meta-value">{formatCurrency(supplier.totalPurchases)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Outstanding</span>
                <span className="meta-value">{formatCurrency(supplier.outstandingAmount)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Last Order</span>
                <span className="meta-value">{format(new Date(supplier.lastOrderDate), 'dd/MM/yyyy')}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Total Orders</span>
                <span className="meta-value">{supplier.totalOrders}</span>
              </div>
            </div>

            <div className="supplier-performance">
              <h5>Performance Metrics</h5>
              <div className="performance-metrics">
                <div className="performance-metric">
                  <div className="metric-value">{supplier.onTimeDeliveryRate}%</div>
                  <div className="metric-label">On-time Delivery</div>
                </div>
                <div className="performance-metric">
                  <div className="metric-value">{supplier.returnRate}%</div>
                  <div className="metric-label">Return Rate</div>
                </div>
                <div className="performance-metric">
                  <div className="metric-value">{supplier.averageDeliveryTime}</div>
                  <div className="metric-label">Avg Delivery (days)</div>
                </div>
              </div>
            </div>

            {supplier.notes && (
              <div className="supplier-notes">
                <strong>Notes:</strong> {supplier.notes}
              </div>
            )}

            <div className="supplier-actions" onClick={(e) => e.stopPropagation()}>
              <button 
                className="btn-icon"
                onClick={() => onSupplierSelect(supplier)}
                title="View Details"
              >
                <Eye size={16} />
              </button>
              <button 
                className="btn-icon"
                title="Edit Supplier"
              >
                <Edit size={16} />
              </button>
              <button 
                className={`btn btn-small ${supplier.status === 'active' ? 'btn-outline' : 'btn-primary'}`}
                onClick={() => toggleSupplierStatus(supplier.id, supplier.status)}
                title={supplier.status === 'active' ? 'Deactivate' : 'Activate'}
              >
                {supplier.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
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
      {filteredSuppliers.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <Package size={48} />
          </div>
          <h3>No suppliers found</h3>
          <p>Try adjusting your search criteria or filters</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSearchTerm('');
              setFilters({
                supplierType: '',
                status: '',
                rating: '',
                paymentTerms: ''
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

export default SupplierList;
