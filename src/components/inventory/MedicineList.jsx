import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  AlertTriangle,
  Package,
  Calendar,
  DollarSign,
  Scan,
  Plus
} from 'lucide-react'
import './MedicineList.css'

const MedicineList = ({ onAddMedicine, onEditMedicine, onScanBarcode }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  // Sample medicine data
  const medicines = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      composition: 'Paracetamol',
      brand: 'Crocin',
      manufacturer: 'GSK',
      batchNumber: 'PCM001',
      expiryDate: '2025-06-15',
      purchasePrice: 45.50,
      mrp: 65.00,
      sellingPrice: 58.50,
      stock: 150,
      minStock: 50,
      supplier: 'MedSupply Co.',
      status: 'active'
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      composition: 'Amoxicillin',
      brand: 'Amoxil',
      manufacturer: 'Cipla',
      batchNumber: 'AMX002',
      expiryDate: '2024-12-30',
      purchasePrice: 85.00,
      mrp: 120.00,
      sellingPrice: 108.00,
      stock: 8,
      minStock: 30,
      supplier: 'PharmaCorp',
      status: 'low_stock'
    },
    {
      id: 3,
      name: 'Ibuprofen 400mg',
      composition: 'Ibuprofen',
      brand: 'Brufen',
      manufacturer: 'Abbott',
      batchNumber: 'IBU003',
      expiryDate: '2024-03-20',
      purchasePrice: 32.00,
      mrp: 48.00,
      sellingPrice: 43.20,
      stock: 75,
      minStock: 40,
      supplier: 'HealthMeds',
      status: 'expiring_soon'
    },
    {
      id: 4,
      name: 'Cough Syrup 100ml',
      composition: 'Dextromethorphan',
      brand: 'Benadryl',
      manufacturer: 'Johnson & Johnson',
      batchNumber: 'CS004',
      expiryDate: '2025-08-10',
      purchasePrice: 95.00,
      mrp: 135.00,
      sellingPrice: 121.50,
      stock: 5,
      minStock: 25,
      supplier: 'MedSupply Co.',
      status: 'low_stock'
    }
  ]

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.composition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.brand.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === 'all') return matchesSearch
    if (filterBy === 'low_stock') return matchesSearch && medicine.status === 'low_stock'
    if (filterBy === 'expiring_soon') return matchesSearch && medicine.status === 'expiring_soon'
    if (filterBy === 'active') return matchesSearch && medicine.status === 'active'
    
    return matchesSearch
  })

  const getStatusBadge = (status) => {
    const badges = {
      active: { label: 'Active', class: 'status-active' },
      low_stock: { label: 'Low Stock', class: 'status-low-stock' },
      expiring_soon: { label: 'Expiring Soon', class: 'status-expiring' }
    }
    return badges[status] || badges.active
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`
  }

  return (
    <div className="medicine-list">
      {/* Search and Filter Bar */}
      <div className="list-controls">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search medicines, composition, or brand..."
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
            <option value="all">All Medicines</option>
            <option value="active">Active</option>
            <option value="low_stock">Low Stock</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="expiry">Sort by Expiry</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={onScanBarcode}>
            <Scan size={18} />
            <span>Scan Barcode</span>
          </button>
          <button className="btn btn-primary" onClick={onAddMedicine}>
            <Plus size={18} />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Medicine Cards Grid */}
      <div className="medicine-grid">
        {filteredMedicines.map((medicine) => {
          const statusBadge = getStatusBadge(medicine.status)
          return (
            <div key={medicine.id} className="medicine-card">
              <div className="card-header">
                <div className="medicine-info">
                  <h3 className="medicine-name">{medicine.name}</h3>
                  <p className="medicine-composition">{medicine.composition}</p>
                  <p className="medicine-brand">{medicine.brand} - {medicine.manufacturer}</p>
                </div>
                <div className={`status-badge ${statusBadge.class}`}>
                  {statusBadge.label}
                </div>
              </div>

              <div className="card-body">
                <div className="medicine-details">
                  <div className="detail-row">
                    <span className="detail-label">Batch:</span>
                    <span className="detail-value">{medicine.batchNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Expiry:</span>
                    <span className="detail-value">{formatDate(medicine.expiryDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Stock:</span>
                    <span className={`detail-value ${medicine.stock <= medicine.minStock ? 'low-stock' : ''}`}>
                      {medicine.stock} units
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">MRP:</span>
                    <span className="detail-value">{formatCurrency(medicine.mrp)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Selling Price:</span>
                    <span className="detail-value">{formatCurrency(medicine.sellingPrice)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Supplier:</span>
                    <span className="detail-value">{medicine.supplier}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button 
                  className="action-btn view-btn"
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={() => onEditMedicine(medicine)}
                  title="Edit Medicine"
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="action-btn delete-btn"
                  title="Delete Medicine"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No medicines found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

export default MedicineList
