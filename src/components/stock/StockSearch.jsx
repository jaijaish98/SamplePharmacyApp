import { useState } from 'react';
import { Search, Filter, Package, Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useStock } from '../../contexts/StockContext';

const StockSearch = () => {
  const { 
    getFilteredStockItems, 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters, 
    stockItems,
    loading 
  } = useStock();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredItems = getFilteredStockItems();
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Get unique values for filter options
  const categories = [...new Set(stockItems.map(item => item.category))];
  const brands = [...new Set(stockItems.map(item => item.brand))];
  const suppliers = [...new Set(stockItems.map(item => item.supplier))];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      brand: '',
      stockStatus: '',
      expiryStatus: ''
    });
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatusBadge = (item) => {
    if (item.isOutOfStock) {
      return { class: 'out-of-stock', label: 'Out of Stock', color: '#ef4444' };
    } else if (item.isLowStock) {
      return { class: 'low-stock', label: 'Low Stock', color: '#f59e0b' };
    } else {
      return { class: 'in-stock', label: 'In Stock', color: '#10b981' };
    }
  };

  if (loading) {
    return (
      <div className="stock-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading stock search...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-container">
      {/* Search Section */}
      <div className="stock-section">
        <h3>Advanced Stock Search</h3>
        
        {/* Main Search Bar */}
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, brand, salt, category, batch number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            className={`btn btn-outline ${showAdvancedFilters ? 'active' : ''}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter size={16} />
            Advanced Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="advanced-filters">
            <div className="filter-grid">
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Stock Status</label>
                <select
                  value={filters.stockStatus}
                  onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Stock Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Expiry Status</label>
                <select
                  value={filters.expiryStatus}
                  onChange={(e) => handleFilterChange('expiryStatus', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Expiry Status</option>
                  <option value="valid">Valid (&gt;30 days)</option>
                  <option value="near_expiry">Near Expiry (≤30 days)</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
            
            <div className="filter-actions">
              <button 
                className="btn btn-outline"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="stock-section">
        <div className="section-header">
          <h4>Search Results ({filteredItems.length} items found)</h4>
          <div className="result-actions">
            <span>Page {currentPage} of {totalPages}</span>
          </div>
        </div>

        {/* Results List */}
        <div className="search-results">
          {paginatedItems.map((item) => {
            const stockStatus = getStockStatusBadge(item);
            
            return (
              <div key={item.id} className={`search-result-card ${stockStatus.class}`}>
                <div className="result-header">
                  <div className="result-info">
                    <h5>{item.name}</h5>
                    <div className="result-details">
                      <span>Brand: {item.brand}</span>
                      <span>Category: {item.category}</span>
                      <span>Salt: {item.salt}</span>
                      <span>Batch: {item.batchNumber}</span>
                    </div>
                  </div>
                  
                  <div className="result-status">
                    <div 
                      className="stock-status-indicator"
                      style={{ backgroundColor: stockStatus.color }}
                    >
                      {stockStatus.label}
                    </div>
                    <div className="stock-quantity">
                      {item.currentStock} units
                    </div>
                  </div>
                </div>

                <div className="result-metrics">
                  <div className="metric-grid">
                    <div className="metric">
                      <span className="metric-label">Reorder Level</span>
                      <span className="metric-value">{item.reorderLevel}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Location</span>
                      <span className="metric-value">{item.location}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Cost Price</span>
                      <span className="metric-value">{formatCurrency(item.costPrice)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">MRP</span>
                      <span className="metric-value">{formatCurrency(item.mrp)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Stock Value</span>
                      <span className="metric-value">{formatCurrency(item.currentStock * item.costPrice)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Expiry Date</span>
                      <span className="metric-value">
                        {format(new Date(item.expiryDate), 'dd/MM/yyyy')}
                        {item.isNearExpiry && (
                          <span className="expiry-warning">
                            <AlertTriangle size={12} />
                            {item.daysToExpiry} days left
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="result-actions">
                  <button className="btn btn-outline btn-small">
                    View Details
                  </button>
                  <button className="btn btn-primary btn-small">
                    Adjust Stock
                  </button>
                  {item.isLowStock && (
                    <button className="btn btn-secondary btn-small">
                      Reorder
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
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
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
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No items found</h3>
          <p>Try adjusting your search criteria or filters</p>
          <button 
            className="btn btn-primary"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Search Summary */}
      <div className="search-summary">
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-label">Total Items Found</span>
            <span className="stat-value">{filteredItems.length}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Stock Value</span>
            <span className="stat-value">
              {formatCurrency(filteredItems.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0))}
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Low Stock Items</span>
            <span className="stat-value">{filteredItems.filter(item => item.isLowStock).length}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Out of Stock Items</span>
            <span className="stat-value">{filteredItems.filter(item => item.isOutOfStock).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockSearch;
