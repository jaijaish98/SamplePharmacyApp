import { useState, useEffect } from 'react'
import { X, Save, Plus, Minus, Package, Search } from 'lucide-react'
import './StockAdjustment.css'

const StockAdjustment = ({ type, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    medicineId: '',
    medicineName: '',
    currentStock: 0,
    adjustmentQuantity: '',
    reason: '',
    notes: '',
    batchNumber: '',
    expiryDate: '',
    supplier: '',
    purchasePrice: '',
    billNumber: '',
    adjustmentType: type // 'add' or 'reduce'
  })

  const [errors, setErrors] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showMedicineSearch, setShowMedicineSearch] = useState(false)

  // Sample medicine data for search
  const medicines = [
    { id: 1, name: 'Paracetamol 500mg', brand: 'Crocin', currentStock: 150 },
    { id: 2, name: 'Amoxicillin 250mg', brand: 'Amoxil', currentStock: 25 },
    { id: 3, name: 'Ibuprofen 400mg', brand: 'Brufen', currentStock: 0 },
    { id: 4, name: 'Vitamin D3 1000IU', brand: 'HealthVit', currentStock: 200 },
    { id: 5, name: 'Cough Syrup 100ml', brand: 'Benadryl', currentStock: 15 }
  ]

  const addReasons = [
    'New Purchase',
    'Stock Return',
    'Transfer In',
    'Correction - Count Error',
    'Donation Received',
    'Other'
  ]

  const reduceReasons = [
    'Sale',
    'Damage',
    'Expiry',
    'Return to Supplier',
    'Transfer Out',
    'Theft/Loss',
    'Correction - Count Error',
    'Sample Given',
    'Other'
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
    
    // Clear error when user starts typing
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
      medicineName: medicine.name,
      currentStock: medicine.currentStock
    }))
    setShowMedicineSearch(false)
    setSearchTerm('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.medicineId) newErrors.medicineId = 'Please select a medicine'
    if (!formData.adjustmentQuantity || formData.adjustmentQuantity <= 0) {
      newErrors.adjustmentQuantity = 'Please enter a valid quantity'
    }
    if (!formData.reason) newErrors.reason = 'Please select a reason'

    // Additional validations for stock addition
    if (type === 'add') {
      if (formData.reason === 'New Purchase') {
        if (!formData.batchNumber) newErrors.batchNumber = 'Batch number is required for new purchases'
        if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required for new purchases'
        if (!formData.supplier) newErrors.supplier = 'Supplier is required for new purchases'
        if (!formData.purchasePrice || formData.purchasePrice <= 0) {
          newErrors.purchasePrice = 'Purchase price is required for new purchases'
        }
      }
    }

    // Validation for stock reduction
    if (type === 'reduce') {
      const newStock = formData.currentStock - parseInt(formData.adjustmentQuantity)
      if (newStock < 0) {
        newErrors.adjustmentQuantity = 'Cannot reduce more than current stock'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Simulate API call
      console.log('Stock adjustment:', formData)
      onSave(formData)
    }
  }

  const getTitle = () => {
    return type === 'add' ? 'Add Stock' : 'Reduce Stock'
  }

  const getIcon = () => {
    return type === 'add' ? <Plus size={24} /> : <Minus size={24} />
  }

  const getReasons = () => {
    return type === 'add' ? addReasons : reduceReasons
  }

  return (
    <div className="stock-adjustment-overlay">
      <div className="stock-adjustment-modal">
        <div className="form-header">
          <div className="header-content">
            {getIcon()}
            <h2>{getTitle()}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="adjustment-form">
          <div className="form-grid">
            {/* Medicine Selection */}
            <div className="form-section">
              <h3>Medicine Selection</h3>
              
              <div className="form-group">
                <label>Select Medicine *</label>
                <div className="medicine-selector">
                  <div 
                    className={`medicine-input ${errors.medicineId ? 'error' : ''}`}
                    onClick={() => setShowMedicineSearch(true)}
                  >
                    {formData.medicineName || 'Click to select medicine...'}
                    <Search size={16} />
                  </div>
                  {errors.medicineId && <span className="error-text">{errors.medicineId}</span>}
                </div>

                {showMedicineSearch && (
                  <div className="medicine-search-dropdown">
                    <input
                      type="text"
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                      autoFocus
                    />
                    <div className="medicine-list">
                      {filteredMedicines.map((medicine) => (
                        <div
                          key={medicine.id}
                          className="medicine-item"
                          onClick={() => handleMedicineSelect(medicine)}
                        >
                          <div className="medicine-info">
                            <span className="medicine-name">{medicine.name}</span>
                            <span className="medicine-brand">{medicine.brand}</span>
                          </div>
                          <span className="current-stock">Stock: {medicine.currentStock}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {formData.medicineId && (
                <div className="current-stock-display">
                  <Package size={16} />
                  <span>Current Stock: <strong>{formData.currentStock}</strong></span>
                </div>
              )}
            </div>

            {/* Adjustment Details */}
            <div className="form-section">
              <h3>Adjustment Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="adjustmentQuantity">
                    {type === 'add' ? 'Quantity to Add' : 'Quantity to Reduce'} *
                  </label>
                  <input
                    type="number"
                    id="adjustmentQuantity"
                    name="adjustmentQuantity"
                    value={formData.adjustmentQuantity}
                    onChange={handleInputChange}
                    className={errors.adjustmentQuantity ? 'error' : ''}
                    placeholder="Enter quantity"
                    min="1"
                  />
                  {errors.adjustmentQuantity && <span className="error-text">{errors.adjustmentQuantity}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="reason">Reason *</label>
                  <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className={errors.reason ? 'error' : ''}
                  >
                    <option value="">Select reason</option>
                    {getReasons().map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                  {errors.reason && <span className="error-text">{errors.reason}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes..."
                  rows="3"
                />
              </div>
            </div>

            {/* Additional Fields for New Purchase */}
            {type === 'add' && formData.reason === 'New Purchase' && (
              <div className="form-section">
                <h3>Purchase Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="batchNumber">Batch Number *</label>
                    <input
                      type="text"
                      id="batchNumber"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                      className={errors.batchNumber ? 'error' : ''}
                      placeholder="Enter batch number"
                    />
                    {errors.batchNumber && <span className="error-text">{errors.batchNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date *</label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={errors.expiryDate ? 'error' : ''}
                    />
                    {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="supplier">Supplier *</label>
                    <input
                      type="text"
                      id="supplier"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className={errors.supplier ? 'error' : ''}
                      placeholder="Enter supplier name"
                    />
                    {errors.supplier && <span className="error-text">{errors.supplier}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="purchasePrice">Purchase Price (₹) *</label>
                    <input
                      type="number"
                      id="purchasePrice"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleInputChange}
                      className={errors.purchasePrice ? 'error' : ''}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                    {errors.purchasePrice && <span className="error-text">{errors.purchasePrice}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="billNumber">Bill/Invoice Number</label>
                  <input
                    type="text"
                    id="billNumber"
                    name="billNumber"
                    value={formData.billNumber}
                    onChange={handleInputChange}
                    placeholder="Enter bill/invoice number"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              {type === 'add' ? 'Add Stock' : 'Reduce Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StockAdjustment
