import { useState } from 'react';
import { Activity, Search, Filter, Package, ShoppingCart, Settings, ArrowUpDown, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useStock } from '../../contexts/StockContext';

const StockHistory = () => {
  const { stockMovements, stockItems, getItemMovements, loading } = useStock();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    dateRange: '7',
    user: '',
    item: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const movementTypes = [
    { value: 'sale', label: 'Sale', icon: ShoppingCart, color: '#ef4444' },
    { value: 'purchase', label: 'Purchase', icon: Package, color: '#10b981' },
    { value: 'adjustment', label: 'Adjustment', icon: Settings, color: '#f59e0b' },
    { value: 'transfer', label: 'Transfer', icon: ArrowUpDown, color: '#2563eb' },
    { value: 'return', label: 'Return', icon: Package, color: '#8b5cf6' }
  ];

  const getFilteredMovements = () => {
    return stockMovements.filter(movement => {
      const matchesSearch = !searchTerm || 
        movement.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.user.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !filters.type || movement.type === filters.type;
      const matchesItem = !filters.item || movement.itemId === parseInt(filters.item);
      const matchesUser = !filters.user || movement.user.toLowerCase().includes(filters.user.toLowerCase());

      // Date range filter
      const matchesDate = (() => {
        if (!filters.dateRange) return true;
        const days = parseInt(filters.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return new Date(movement.date) >= cutoffDate;
      })();

      return matchesSearch && matchesType && matchesItem && matchesUser && matchesDate;
    });
  };

  const filteredMovements = getFilteredMovements();
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovements = filteredMovements.slice(startIndex, startIndex + itemsPerPage);

  const getMovementTypeInfo = (type) => {
    return movementTypes.find(mt => mt.value === type) || { 
      value: type, 
      label: type, 
      icon: Activity, 
      color: '#6b7280' 
    };
  };

  const formatQuantity = (quantity) => {
    return quantity >= 0 ? `+${quantity}` : quantity.toString();
  };

  const getQuantityColor = (quantity) => {
    return quantity >= 0 ? '#10b981' : '#ef4444';
  };

  if (loading) {
    return (
      <div className="stock-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading stock history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-container">
      <div className="stock-section">
        <h3>Stock Movement History</h3>
        <p>Complete audit trail of all stock movements and changes</p>
      </div>

      {/* Search and Filters */}
      <div className="stock-section">
        <div className="search-filter-section">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by item name, reason, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-grid">
          <div className="filter-group">
            <label>Movement Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="filter-select"
            >
              <option value="">All Types</option>
              {movementTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="filter-select"
            >
              <option value="">All Time</option>
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Item</label>
            <select
              value={filters.item}
              onChange={(e) => setFilters(prev => ({ ...prev, item: e.target.value }))}
              className="filter-select"
            >
              <option value="">All Items</option>
              {stockItems.slice(0, 20).map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>User</label>
            <input
              type="text"
              placeholder="Filter by user"
              value={filters.user}
              onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      {/* Movement Statistics */}
      <div className="movement-stats">
        <div className="stats-grid">
          {movementTypes.map(type => {
            const count = filteredMovements.filter(m => m.type === type.value).length;
            const IconComponent = type.icon;
            
            return (
              <div key={type.value} className="stat-card">
                <div className="stat-icon" style={{ color: type.color }}>
                  <IconComponent size={20} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{count}</div>
                  <div className="stat-label">{type.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {paginatedMovements.length} of {filteredMovements.length} movements</p>
        {totalPages > 1 && (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      {/* Movement History List */}
      <div className="history-timeline">
        {paginatedMovements.map((movement) => {
          const typeInfo = getMovementTypeInfo(movement.type);
          const IconComponent = typeInfo.icon;
          
          return (
            <div key={movement.id} className={`history-item ${movement.type}`}>
              <div className="history-icon" style={{ backgroundColor: typeInfo.color }}>
                <IconComponent size={16} />
              </div>
              
              <div className="history-content">
                <div className="history-header">
                  <div className="history-action">
                    <strong>{typeInfo.label}</strong> - {movement.itemName}
                  </div>
                  <div className="history-time">
                    <Calendar size={14} />
                    {format(new Date(movement.date), 'dd/MM/yyyy HH:mm')}
                  </div>
                </div>
                
                <div className="history-details">
                  <div className="detail-item">
                    <span className="detail-label">Quantity:</span>
                    <span 
                      className="detail-value quantity"
                      style={{ color: getQuantityColor(movement.quantity) }}
                    >
                      {formatQuantity(movement.quantity)}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Reason:</span>
                    <span className="detail-value">{movement.reason}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">User:</span>
                    <span className="detail-value">{movement.user}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Batch:</span>
                    <span className="detail-value">{movement.batchNumber}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Balance After:</span>
                    <span className="detail-value">{movement.balanceAfter}</span>
                  </div>
                </div>
                
                {movement.notes && (
                  <div className="history-notes">
                    <strong>Notes:</strong> {movement.notes}
                  </div>
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

      {/* Empty State */}
      {filteredMovements.length === 0 && (
        <div className="empty-state">
          <Activity size={48} />
          <h3>No movements found</h3>
          <p>Try adjusting your search criteria or filters</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSearchTerm('');
              setFilters({ type: '', dateRange: '7', user: '', item: '' });
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Export Options */}
      <div className="export-section">
        <h4>Export Movement History</h4>
        <div className="export-buttons">
          <button className="btn btn-outline">
            Export to Excel
          </button>
          <button className="btn btn-outline">
            Export to PDF
          </button>
          <button className="btn btn-outline">
            Email Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockHistory;
