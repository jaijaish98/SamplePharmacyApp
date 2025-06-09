import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Minus,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Edit,
  RefreshCw,
  Calendar
} from 'lucide-react'
import './StockOverview.css'

const StockOverview = ({ onStockAdd, onStockReduce, onStockTransfer }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  // Sample stock data with real-time updates
  const stockData = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      brand: 'Crocin',
      category: 'Analgesic',
      currentStock: 150,
      reorderLevel: 50,
      maxStock: 500,
      unit: 'tablets',
      lastUpdated: '2024-03-15 10:30 AM',
      status: 'in_stock',
      location: 'A-1-01',
      batchCount: 3,
      nearExpiry: 0
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      brand: 'Amoxil',
      category: 'Antibiotic',
      currentStock: 25,
      reorderLevel: 30,
      maxStock: 200,
      unit: 'capsules',
      lastUpdated: '2024-03-15 09:15 AM',
      status: 'low_stock',
      location: 'B-2-05',
      batchCount: 2,
      nearExpiry: 1
    },
    {
      id: 3,
      name: 'Ibuprofen 400mg',
      brand: 'Brufen',
      category: 'Analgesic',
      currentStock: 0,
      reorderLevel: 40,
      maxStock: 300,
      unit: 'tablets',
      lastUpdated: '2024-03-14 05:45 PM',
      status: 'out_of_stock',
      location: 'C-1-03',
      batchCount: 0,
      nearExpiry: 0
    },
    {
      id: 4,
      name: 'Vitamin D3 1000IU',
      brand: 'HealthVit',
      category: 'Vitamin',
      currentStock: 200,
      reorderLevel: 50,
      maxStock: 400,
      unit: 'tablets',
      lastUpdated: '2024-03-15 11:20 AM',
      status: 'in_stock',
      location: 'D-3-01',
      batchCount: 2,
      nearExpiry: 1
    },
    {
      id: 5,
      name: 'Cough Syrup 100ml',
      brand: 'Benadryl',
      category: 'Cough & Cold',
      currentStock: 15,
      reorderLevel: 25,
      maxStock: 100,
      unit: 'bottles',
      lastUpdated: '2024-03-15 08:30 AM',
      status: 'low_stock',
      location: 'E-1-02',
      batchCount: 1,
      nearExpiry: 0
    }
  ]

  const filteredStock = stockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === 'all') return matchesSearch
    if (filterBy === 'in_stock') return matchesSearch && item.status === 'in_stock'
    if (filterBy === 'low_stock') return matchesSearch && item.status === 'low_stock'
    if (filterBy === 'out_of_stock') return matchesSearch && item.status === 'out_of_stock'
    if (filterBy === 'near_expiry') return matchesSearch && item.nearExpiry > 0
    
    return matchesSearch
  })

  const getStatusInfo = (status) => {
    const statusMap = {
      in_stock: { label: 'In Stock', class: 'status-in-stock', icon: CheckCircle },
      low_stock: { label: 'Low Stock', class: 'status-low-stock', icon: AlertTriangle },
      out_of_stock: { label: 'Out of Stock', class: 'status-out-stock', icon: XCircle }
    }
    return statusMap[status] || statusMap.in_stock
  }

  const getStockPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100)
  }

  const getStockBarColor = (current, reorder, max) => {
    if (current === 0) return '#ef4444'
    if (current <= reorder) return '#f59e0b'
    if (current >= max * 0.8) return '#10b981'
    return '#3b82f6'
  }

  return (
    <div className="stock-overview">
      {/* Search and Filter Controls */}
      <div className="overview-controls">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search medicines, brands, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Items</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="near_expiry">Near Expiry</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock Level</option>
            <option value="category">Sort by Category</option>
            <option value="updated">Sort by Last Updated</option>
          </select>
        </div>

        <button className="btn btn-secondary refresh-btn">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Stock Items Grid */}
      <div className="stock-grid">
        {filteredStock.map((item) => {
          const statusInfo = getStatusInfo(item.status)
          const StatusIcon = statusInfo.icon
          const stockPercentage = getStockPercentage(item.currentStock, item.maxStock)
          const stockBarColor = getStockBarColor(item.currentStock, item.reorderLevel, item.maxStock)
          
          return (
            <div key={item.id} className="stock-card">
              <div className="card-header">
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-brand">{item.brand}</p>
                  <span className="item-category">{item.category}</span>
                </div>
                <div className={`status-badge ${statusInfo.class}`}>
                  <StatusIcon size={14} />
                  <span>{statusInfo.label}</span>
                </div>
              </div>

              <div className="card-body">
                {/* Stock Level Indicator */}
                <div className="stock-level">
                  <div className="stock-info">
                    <span className="current-stock">{item.currentStock}</span>
                    <span className="stock-unit">/ {item.maxStock} {item.unit}</span>
                  </div>
                  <div className="stock-bar">
                    <div 
                      className="stock-fill" 
                      style={{ 
                        width: `${stockPercentage}%`,
                        backgroundColor: stockBarColor
                      }}
                    ></div>
                  </div>
                  <div className="reorder-info">
                    <span className="reorder-level">Reorder at: {item.reorderLevel}</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="item-details">
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value location">{item.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Batches:</span>
                    <span className="detail-value">{item.batchCount}</span>
                  </div>
                  {item.nearExpiry > 0 && (
                    <div className="detail-row warning">
                      <span className="detail-label">Near Expiry:</span>
                      <span className="detail-value">{item.nearExpiry} batch(es)</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">{item.lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="action-buttons">
                  <button 
                    className="action-btn add-btn"
                    onClick={() => onStockAdd(item)}
                    title="Add Stock"
                  >
                    <Plus size={16} />
                  </button>
                  <button 
                    className="action-btn reduce-btn"
                    onClick={() => onStockReduce(item)}
                    title="Reduce Stock"
                    disabled={item.currentStock === 0}
                  >
                    <Minus size={16} />
                  </button>
                  <button 
                    className="action-btn transfer-btn"
                    onClick={() => onStockTransfer(item)}
                    title="Transfer Stock"
                    disabled={item.currentStock === 0}
                  >
                    <ArrowUpDown size={16} />
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    title="Edit Item"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredStock.length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No items found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Quick Stats Summary */}
      <div className="quick-summary">
        <div className="summary-item">
          <CheckCircle size={20} />
          <span>In Stock: {stockData.filter(item => item.status === 'in_stock').length}</span>
        </div>
        <div className="summary-item warning">
          <AlertTriangle size={20} />
          <span>Low Stock: {stockData.filter(item => item.status === 'low_stock').length}</span>
        </div>
        <div className="summary-item danger">
          <XCircle size={20} />
          <span>Out of Stock: {stockData.filter(item => item.status === 'out_of_stock').length}</span>
        </div>
        <div className="summary-item info">
          <Calendar size={20} />
          <span>Near Expiry: {stockData.reduce((sum, item) => sum + item.nearExpiry, 0)} batches</span>
        </div>
      </div>
    </div>
  )
}

export default StockOverview
