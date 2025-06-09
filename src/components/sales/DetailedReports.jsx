import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Package,
  CreditCard,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { useSales } from '../../contexts/SalesContext';
import './DetailedReports.css';

const DetailedReports = () => {
  const { getFilteredSales, filters, setFilters, loading } = useSales();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  const salesData = getFilteredSales();

  // Sort and paginate data
  const sortedData = useMemo(() => {
    const sorted = [...salesData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === 'customer') {
        aValue = a.customer.name;
        bValue = b.customer.name;
      } else if (sortField === 'total') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  }, [salesData, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleDateRangeChange = (start, end) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start: new Date(start), end: new Date(end) }
    }));
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = ['Invoice No', 'Date', 'Customer', 'Items', 'Subtotal', 'Discount', 'GST', 'Total', 'Payment Method', 'Status'];
    const csvData = sortedData.map(sale => [
      sale.invoiceNo,
      format(new Date(sale.date), 'yyyy-MM-dd HH:mm'),
      sale.customer.name,
      sale.items.map(item => `${item.medicine.name} (${item.quantity})`).join('; '),
      sale.subtotal,
      sale.discount,
      sale.gstAmount,
      sale.total,
      sale.paymentMethod,
      sale.status
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="sort-icon" />;
    return <ArrowUpDown size={14} className={`sort-icon ${sortDirection}`} />;
  };

  if (loading) {
    return (
      <div className="reports-loading">
        <RefreshCw className="spinning" size={32} />
        <p>Loading sales reports...</p>
      </div>
    );
  }

  return (
    <div className="detailed-reports">
      {/* Header */}
      <div className="reports-header">
        <div className="header-info">
          <h2>Detailed Sales Reports</h2>
          <p>Comprehensive sales data with advanced filtering and export options</p>
        </div>
        <div className="header-actions">
          <button 
            className={`btn btn-outline ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
          </button>
          <button className="btn btn-secondary" onClick={exportToCSV}>
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Date Range</label>
              <div className="date-inputs">
                <input
                  type="date"
                  value={format(filters.dateRange.start, 'yyyy-MM-dd')}
                  onChange={(e) => handleDateRangeChange(e.target.value, filters.dateRange.end)}
                  className="date-input"
                />
                <span>to</span>
                <input
                  type="date"
                  value={format(filters.dateRange.end, 'yyyy-MM-dd')}
                  onChange={(e) => handleDateRangeChange(filters.dateRange.start, e.target.value)}
                  className="date-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Customer</label>
              <div className="search-input">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={filters.customer}
                  onChange={(e) => handleFilterChange('customer', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Medicine</label>
              <div className="search-input">
                <Package size={16} />
                <input
                  type="text"
                  placeholder="Search medicine..."
                  value={filters.medicine}
                  onChange={(e) => handleFilterChange('medicine', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Payment Method</label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="filter-select"
              >
                <option value="">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Credit">Credit</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Cashier</label>
              <select
                value={filters.cashier}
                onChange={(e) => handleFilterChange('cashier', e.target.value)}
                className="filter-select"
              >
                <option value="">All Cashiers</option>
                <option value="Dr. Sathya">Dr. Sathya</option>
                <option value="Pharmacist A">Pharmacist A</option>
                <option value="Pharmacist B">Pharmacist B</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Include Returns</label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.includeReturns}
                  onChange={(e) => handleFilterChange('includeReturns', e.target.checked)}
                />
                <span className="checkmark"></span>
                Include returned items
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-label">Total Records:</span>
          <span className="stat-value">{sortedData.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Revenue:</span>
          <span className="stat-value">₹{sortedData.reduce((sum, sale) => sum + (sale.status === 'completed' ? sale.total : 0), 0).toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Sale:</span>
          <span className="stat-value">₹{sortedData.length > 0 ? Math.round(sortedData.reduce((sum, sale) => sum + sale.total, 0) / sortedData.length) : 0}</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('invoiceNo')}>
                Invoice No {getSortIcon('invoiceNo')}
              </th>
              <th onClick={() => handleSort('date')}>
                Date & Time {getSortIcon('date')}
              </th>
              <th onClick={() => handleSort('customer')}>
                Customer {getSortIcon('customer')}
              </th>
              <th>Items Sold</th>
              <th onClick={() => handleSort('subtotal')}>
                Subtotal {getSortIcon('subtotal')}
              </th>
              <th onClick={() => handleSort('discount')}>
                Discount {getSortIcon('discount')}
              </th>
              <th onClick={() => handleSort('gstAmount')}>
                GST {getSortIcon('gstAmount')}
              </th>
              <th onClick={() => handleSort('total')}>
                Total {getSortIcon('total')}
              </th>
              <th onClick={() => handleSort('paymentMethod')}>
                Payment {getSortIcon('paymentMethod')}
              </th>
              <th onClick={() => handleSort('status')}>
                Status {getSortIcon('status')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((sale) => (
              <tr key={sale.id} className={sale.status === 'returned' ? 'returned-row' : ''}>
                <td className="invoice-cell">{sale.invoiceNo}</td>
                <td className="date-cell">
                  <div className="date-time">
                    <div>{format(new Date(sale.date), 'dd/MM/yyyy')}</div>
                    <div className="time">{format(new Date(sale.date), 'HH:mm')}</div>
                  </div>
                </td>
                <td className="customer-cell">
                  <div className="customer-info">
                    <div className="customer-name">{sale.customer.name}</div>
                    {sale.customer.phone && (
                      <div className="customer-phone">{sale.customer.phone}</div>
                    )}
                  </div>
                </td>
                <td className="items-cell">
                  <div className="items-summary">
                    {sale.items.map((item, index) => (
                      <div key={index} className="item-line">
                        {item.medicine.name} × {item.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="amount-cell">₹{sale.subtotal.toLocaleString()}</td>
                <td className="amount-cell discount">₹{sale.discount.toLocaleString()}</td>
                <td className="amount-cell gst">₹{sale.gstAmount.toLocaleString()}</td>
                <td className="amount-cell total">₹{sale.total.toLocaleString()}</td>
                <td className="payment-cell">
                  <span className={`payment-badge ${sale.paymentMethod.toLowerCase()}`}>
                    {sale.paymentMethod}
                  </span>
                </td>
                <td className="status-cell">
                  <span className={`status-badge ${sale.status}`}>
                    {sale.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn-icon" title="View Details">
                    <Eye size={16} />
                  </button>
                  <button className="btn-icon" title="Download Invoice">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
        </div>
        <div className="pagination-controls">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="items-per-page"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          
          <div className="page-controls">
            <button
              className="btn btn-outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              className="btn btn-outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedReports;
