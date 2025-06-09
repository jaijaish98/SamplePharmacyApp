import { useState } from 'react'
import {
  ArrowUpDown,
  X,
  Save,
  Search,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import './StockTransfer.css'

const StockTransfer = ({ onClose, onSave, isModal = false }) => {
  const [formData, setFormData] = useState({
    medicineId: '',
    medicineName: '',
    fromBranch: 'main',
    toBranch: '',
    quantity: '',
    reason: '',
    notes: '',
    urgency: 'normal'
  })

  const [errors, setErrors] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showMedicineSearch, setShowMedicineSearch] = useState(false)

  // Sample data
  const branches = [
    { id: 'main', name: 'Main Branch', address: '123 Main Street, Mumbai' },
    { id: 'branch2', name: 'Branch 2', address: '456 Park Avenue, Mumbai' },
    { id: 'branch3', name: 'Branch 3', address: '789 Market Road, Mumbai' }
  ]

  const medicines = [
    { id: 1, name: 'Paracetamol 500mg', brand: 'Crocin', currentStock: 150 },
    { id: 2, name: 'Amoxicillin 250mg', brand: 'Amoxil', currentStock: 25 },
    { id: 3, name: 'Vitamin D3 1000IU', brand: 'HealthVit', currentStock: 200 }
  ]

  const transferHistory = [
    {
      id: 1,
      medicine: 'Paracetamol 500mg',
      fromBranch: 'Main Branch',
      toBranch: 'Branch 2',
      quantity: 50,
      date: '2024-03-14',
      status: 'completed',
      transferredBy: 'Admin User'
    },
    {
      id: 2,
      medicine: 'Vitamin D3 1000IU',
      fromBranch: 'Branch 2',
      toBranch: 'Main Branch',
      quantity: 30,
      date: '2024-03-13',
      status: 'in_transit',
      transferredBy: 'Branch Manager'
    }
  ]

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.brand.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleMedicineSelect = (medicine) => {
    setFormData(prev => ({
      ...prev,
      medicineId: medicine.id,
      medicineName: medicine.name
    }))
    setShowMedicineSearch(false)
    setSearchTerm('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.medicineId) newErrors.medicineId = 'Please select a medicine'
    if (!formData.toBranch) newErrors.toBranch = 'Please select destination branch'
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Please enter a valid quantity'
    }
    if (!formData.reason) newErrors.reason = 'Please enter a reason for transfer'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Stock transfer:', formData)
      onSave && onSave(formData)
    }
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      completed: { label: 'Completed', class: 'status-completed', icon: CheckCircle, color: 'var(--secondary-color)' },
      in_transit: { label: 'In Transit', class: 'status-transit', icon: Clock, color: 'var(--accent-color)' },
      pending: { label: 'Pending', class: 'status-pending', icon: AlertCircle, color: 'var(--primary-color)' }
    }
    return statusMap[status] || statusMap.pending
  }

  const content = (
    <div className="stock-transfer" style={{ padding: isModal ? 0 : '2rem' }}>
      {!isModal && (
        <div className="transfer-header" style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Stock Transfer
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
            Transfer stock between pharmacy branches
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isModal ? '1fr' : '1fr 1fr', gap: '2rem' }}>
        {/* Transfer Form */}
        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--border-color)',
          padding: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 600 }}>
            New Transfer
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Medicine Selection */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Select Medicine *
              </label>
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => setShowMedicineSearch(true)}
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${errors.medicineId ? '#ef4444' : 'var(--border-color)'}`,
                    borderRadius: 'var(--border-radius)',
                    background: 'var(--bg-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{formData.medicineName || 'Click to select medicine...'}</span>
                  <Search size={16} />
                </div>
                {errors.medicineId && (
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>
                    {errors.medicineId}
                  </span>
                )}

                {showMedicineSearch && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 10,
                    marginTop: '0.25rem'
                  }}>
                    <input
                      type="text"
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: 'none',
                        borderBottom: '1px solid var(--border-color)',
                        background: 'transparent',
                        outline: 'none'
                      }}
                      autoFocus
                    />
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {filteredMedicines.map((medicine) => (
                        <div
                          key={medicine.id}
                          onClick={() => handleMedicineSelect(medicine)}
                          style={{
                            padding: '0.75rem',
                            cursor: 'pointer',
                            borderBottom: '1px solid var(--border-color)',
                            transition: 'var(--transition)'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                          <div style={{ fontWeight: 500 }}>{medicine.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {medicine.brand} • Stock: {medicine.currentStock}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Branch Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  From Branch
                </label>
                <select
                  name="fromBranch"
                  value={formData.fromBranch}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  To Branch *
                </label>
                <select
                  name="toBranch"
                  value={formData.toBranch}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.toBranch ? '#ef4444' : 'var(--border-color)'}`,
                    borderRadius: 'var(--border-radius)',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <option value="">Select destination</option>
                  {branches.filter(b => b.id !== formData.fromBranch).map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
                {errors.toBranch && (
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>
                    {errors.toBranch}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity and Urgency */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.quantity ? '#ef4444' : 'var(--border-color)'}`,
                    borderRadius: 'var(--border-radius)',
                    background: 'var(--bg-secondary)'
                  }}
                  placeholder="Enter quantity"
                  min="1"
                />
                {errors.quantity && (
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>
                    {errors.quantity}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  Urgency
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Reason and Notes */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Reason *
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.reason ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--border-radius)',
                  background: 'var(--bg-secondary)'
                }}
                placeholder="e.g., Branch stock shortage"
              />
              {errors.reason && (
                <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>
                  {errors.reason}
                </span>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  background: 'var(--bg-secondary)',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
                placeholder="Any additional notes..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {isModal && (
                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Save size={18} />
                Initiate Transfer
              </button>
            </div>
          </form>
        </div>

        {/* Transfer History */}
        {!isModal && (
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border-color)',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 600 }}>
              Recent Transfers
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {transferHistory.map((transfer) => {
                const statusInfo = getStatusInfo(transfer.status)
                const StatusIcon = statusInfo.icon
                
                return (
                  <div
                    key={transfer.id}
                    style={{
                      padding: '1rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius)',
                      background: 'var(--bg-secondary)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 600 }}>
                          {transfer.medicine}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Quantity: {transfer.quantity}
                        </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: `${statusInfo.color}20`,
                        color: statusInfo.color
                      }}>
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                        <ArrowUpDown size={12} />
                        {transfer.fromBranch} → {transfer.toBranch}
                      </div>
                      <div>{transfer.date} • By {transfer.transferredBy}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  if (isModal) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}>
        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ArrowUpDown size={24} style={{ color: 'var(--primary-color)' }} />
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Stock Transfer</h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                transition: 'var(--transition)'
              }}
            >
              <X size={24} />
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
            {content}
          </div>
        </div>
      </div>
    )
  }

  return content
}

export default StockTransfer
