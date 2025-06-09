import { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Phone, Mail, MapPin, Calendar, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { useCustomers } from '../../contexts/CustomerContext';

const CustomerList = ({ onCustomerSelect }) => {
  const { 
    getFilteredCustomers, 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters, 
    loading,
    deleteCustomer 
  } = useCustomers();

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCustomers = getFilteredCustomers();
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDeleteCustomer = (customerId, customerName) => {
    if (window.confirm(`Are you sure you want to delete customer "${customerName}"?`)) {
      deleteCustomer(customerId);
    }
  };

  const getLoyaltyTier = (points) => {
    if (points >= 3000) return { tier: 'gold', label: 'Gold' };
    if (points >= 1000) return { tier: 'silver', label: 'Silver' };
    return { tier: 'bronze', label: 'Bronze' };
  };

  const getCustomerInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="customer-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-container">
      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, phone, email, or customer code..."
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
        <div className="customer-section">
          <h4>Filter Customers</h4>
          <div className="form-grid">
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
              <label>Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="filter-select"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Age Group</label>
              <select
                value={filters.ageGroup}
                onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                className="filter-select"
              >
                <option value="">All Ages</option>
                <option value="young">Under 30</option>
                <option value="middle">30-60</option>
                <option value="senior">60+</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Loyalty Tier</label>
              <select
                value={filters.loyaltyTier}
                onChange={(e) => handleFilterChange('loyaltyTier', e.target.value)}
                className="filter-select"
              >
                <option value="">All Tiers</option>
                <option value="bronze">Bronze (&lt;1000 pts)</option>
                <option value="silver">Silver (1000-3000 pts)</option>
                <option value="gold">Gold (3000+ pts)</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Tags</label>
              <select
                value={filters.tags}
                onChange={(e) => handleFilterChange('tags', e.target.value)}
                className="filter-select"
              >
                <option value="">All Tags</option>
                <option value="Regular Customer">Regular Customer</option>
                <option value="VIP">VIP</option>
                <option value="Elderly">Elderly</option>
                <option value="Diabetic">Diabetic</option>
                <option value="B2B Customer">B2B Customer</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {paginatedCustomers.length} of {filteredCustomers.length} customers</p>
      </div>

      {/* Customer List */}
      <div className="customer-list">
        {paginatedCustomers.map((customer) => {
          const loyaltyTier = getLoyaltyTier(customer.loyaltyPoints);
          
          return (
            <div key={customer.id} className="customer-card">
              <div className="customer-avatar">
                {getCustomerInitials(customer.name)}
              </div>
              
              <div className="customer-info">
                <div className="customer-name">{customer.name}</div>
                <div className="customer-details">
                  <span><Phone size={14} /> {customer.phone}</span>
                  {customer.email && <span><Mail size={14} /> {customer.email}</span>}
                  <span>{customer.age} years, {customer.gender}</span>
                </div>
                <div className="customer-meta">
                  <span>ID: {customer.customerCode}</span>
                  <span><Calendar size={12} /> Last visit: {format(new Date(customer.lastVisit), 'dd/MM/yyyy')}</span>
                  <span><Gift size={12} /> {customer.loyaltyPoints} points</span>
                  <span className={`loyalty-badge ${loyaltyTier.tier}`}>
                    {loyaltyTier.label}
                  </span>
                  <span className={`status-badge ${customer.status}`}>
                    {customer.status}
                  </span>
                  {customer.mobileVerified && (
                    <span className="status-badge verified">Verified</span>
                  )}
                </div>
                {customer.tags.length > 0 && (
                  <div className="customer-tags">
                    {customer.tags.map((tag, index) => (
                      <span key={index} className="customer-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="customer-actions">
                <button 
                  className="btn-icon"
                  onClick={() => onCustomerSelect(customer)}
                  title="View Profile"
                >
                  <Eye size={16} />
                </button>
                <button 
                  className="btn-icon"
                  title="Edit Customer"
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="btn-icon danger"
                  onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                  title="Delete Customer"
                >
                  <Trash2 size={16} />
                </button>
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
      {filteredCustomers.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <Search size={48} />
          </div>
          <h3>No customers found</h3>
          <p>Try adjusting your search criteria or filters</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSearchTerm('');
              setFilters({
                status: '',
                gender: '',
                ageGroup: '',
                tags: '',
                loyaltyTier: '',
                lastVisit: ''
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

export default CustomerList;
