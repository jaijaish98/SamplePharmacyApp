import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import './BatchManagement.css'

const BatchManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('expiry')

  // Sample batch data
  const batches = [
    {
      id: 1,
      medicineId: 1,
      medicineName: 'Paracetamol 500mg',
      batchNumber: 'PCM001',
      manufacturingDate: '2024-01-15',
      expiryDate: '2025-06-15',
      quantity: 150,
      purchasePrice: 45.50,
      totalValue: 6825.00,
      supplier: 'MedSupply Co.',
      status: 'active',
      location: 'A-1-01'
    },
    {
      id: 2,
      medicineId: 1,
      medicineName: 'Paracetamol 500mg',
      batchNumber: 'PCM002',
      manufacturingDate: '2024-03-10',
      expiryDate: '2025-08-10',
      quantity: 200,
      purchasePrice: 47.00,
      totalValue: 9400.00,
      supplier: 'MedSupply Co.',
      status: 'active',
      location: 'A-1-02'
    },
    {
      id: 3,
      medicineId: 2,
      medicineName: 'Amoxicillin 250mg',
      batchNumber: 'AMX002',
      manufacturingDate: '2023-12-30',
      expiryDate: '2024-12-30',
      quantity: 8,
      purchasePrice: 85.00,
      totalValue: 680.00,
      supplier: 'PharmaCorp',
      status: 'low_stock',
      location: 'B-2-05'
    },
    {
      id: 4,
      medicineId: 3,
      medicineName: 'Ibuprofen 400mg',
      batchNumber: 'IBU003',
      manufacturingDate: '2023-09-20',
      expiryDate: '2024-03-20',
      quantity: 75,
      purchasePrice: 32.00,
      totalValue: 2400.00,
      supplier: 'HealthMeds',
      status: 'expiring_soon',
      location: 'C-1-03'
    },
    {
      id: 5,
      medicineId: 4,
      medicineName: 'Cough Syrup 100ml',
      batchNumber: 'CS004',
      manufacturingDate: '2024-02-10',
      expiryDate: '2025-08-10',
      quantity: 5,
      purchasePrice: 95.00,
      totalValue: 475.00,
      supplier: 'MedSupply Co.',
      status: 'low_stock',
      location: 'D-3-01'
    }
  ]

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === 'all') return matchesSearch
    if (filterBy === 'active') return matchesSearch && batch.status === 'active'
    if (filterBy === 'low_stock') return matchesSearch && batch.status === 'low_stock'
    if (filterBy === 'expiring_soon') return matchesSearch && batch.status === 'expiring_soon'
    
    return matchesSearch
  })

  const getStatusBadge = (status) => {
    const badges = {
      active: { label: 'Active', class: 'status-active', icon: CheckCircle },
      low_stock: { label: 'Low Stock', class: 'status-low-stock', icon: AlertTriangle },
      expiring_soon: { label: 'Expiring Soon', class: 'status-expiring', icon: Clock }
    }
    return badges[status] || badges.active
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`
  }

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="batch-management">
      <div className="batch-header">
        <div className="header-content">
          <h2>Batch Management</h2>
          <p>Track and manage medicine batches with expiry monitoring</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add New Batch
        </button>
      </div>

      {/* Controls */}
      <div className="batch-controls">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search batches, medicines, or suppliers..."
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
            <option value="all">All Batches</option>
            <option value="active">Active</option>
            <option value="low_stock">Low Stock</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="expiry">Sort by Expiry</option>
            <option value="medicine">Sort by Medicine</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="value">Sort by Value</option>
          </select>
        </div>
      </div>

      {/* Batch Table */}
      <div className="batch-table-container">
        <table className="batch-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Batch Number</th>
              <th>Manufacturing Date</th>
              <th>Expiry Date</th>
              <th>Days to Expiry</th>
              <th>Quantity</th>
              <th>Purchase Price</th>
              <th>Total Value</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.map((batch) => {
              const statusBadge = getStatusBadge(batch.status)
              const StatusIcon = statusBadge.icon
              const daysToExpiry = getDaysUntilExpiry(batch.expiryDate)
              
              return (
                <tr key={batch.id} className={`batch-row ${batch.status}`}>
                  <td>
                    <div className="medicine-cell">
                      <Package size={16} />
                      <span>{batch.medicineName}</span>
                    </div>
                  </td>
                  <td className="batch-number">{batch.batchNumber}</td>
                  <td>{formatDate(batch.manufacturingDate)}</td>
                  <td className={daysToExpiry <= 30 ? 'expiry-warning' : ''}>
                    {formatDate(batch.expiryDate)}
                  </td>
                  <td className={`days-to-expiry ${daysToExpiry <= 30 ? 'warning' : daysToExpiry <= 90 ? 'caution' : 'safe'}`}>
                    {daysToExpiry > 0 ? `${daysToExpiry} days` : 'Expired'}
                  </td>
                  <td className={batch.quantity <= 10 ? 'low-quantity' : ''}>{batch.quantity}</td>
                  <td>{formatCurrency(batch.purchasePrice)}</td>
                  <td className="total-value">{formatCurrency(batch.totalValue)}</td>
                  <td className="location">{batch.location}</td>
                  <td>
                    <div className={`status-badge ${statusBadge.class}`}>
                      <StatusIcon size={14} />
                      <span>{statusBadge.label}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit-btn" title="Edit Batch">
                        <Edit size={14} />
                      </button>
                      <button className="action-btn delete-btn" title="Delete Batch">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredBatches.length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No batches found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="batch-summary">
        <div className="summary-card">
          <div className="summary-icon active">
            <CheckCircle size={24} />
          </div>
          <div className="summary-content">
            <h3>Active Batches</h3>
            <p className="summary-value">{batches.filter(b => b.status === 'active').length}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon warning">
            <AlertTriangle size={24} />
          </div>
          <div className="summary-content">
            <h3>Low Stock Batches</h3>
            <p className="summary-value">{batches.filter(b => b.status === 'low_stock').length}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon danger">
            <Clock size={24} />
          </div>
          <div className="summary-content">
            <h3>Expiring Soon</h3>
            <p className="summary-value">{batches.filter(b => b.status === 'expiring_soon').length}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon info">
            <Package size={24} />
          </div>
          <div className="summary-content">
            <h3>Total Value</h3>
            <p className="summary-value">{formatCurrency(batches.reduce((sum, b) => sum + b.totalValue, 0))}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BatchManagement
