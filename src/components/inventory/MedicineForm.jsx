import { useState, useEffect } from 'react'
import { X, Save, Package, Scan } from 'lucide-react'
import './MedicineForm.css'

const MedicineForm = ({ medicine, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    composition: '',
    brand: '',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '',
    purchasePrice: '',
    mrp: '',
    sellingPrice: '',
    stock: '',
    minStock: '',
    supplier: '',
    description: '',
    category: '',
    unit: 'tablets',
    prescriptionRequired: false,
    storageConditions: 'room_temperature'
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || '',
        composition: medicine.composition || '',
        brand: medicine.brand || '',
        manufacturer: medicine.manufacturer || '',
        batchNumber: medicine.batchNumber || '',
        expiryDate: medicine.expiryDate || '',
        purchasePrice: medicine.purchasePrice || '',
        mrp: medicine.mrp || '',
        sellingPrice: medicine.sellingPrice || '',
        stock: medicine.stock || '',
        minStock: medicine.minStock || '',
        supplier: medicine.supplier || '',
        description: medicine.description || '',
        category: medicine.category || '',
        unit: medicine.unit || 'tablets',
        prescriptionRequired: medicine.prescriptionRequired || false,
        storageConditions: medicine.storageConditions || 'room_temperature'
      })
    }
  }, [medicine])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Medicine name is required'
    if (!formData.composition.trim()) newErrors.composition = 'Composition is required'
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required'
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required'
    if (!formData.batchNumber.trim()) newErrors.batchNumber = 'Batch number is required'
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
    if (!formData.purchasePrice || formData.purchasePrice <= 0) newErrors.purchasePrice = 'Valid purchase price is required'
    if (!formData.mrp || formData.mrp <= 0) newErrors.mrp = 'Valid MRP is required'
    if (!formData.sellingPrice || formData.sellingPrice <= 0) newErrors.sellingPrice = 'Valid selling price is required'
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required'
    if (!formData.minStock || formData.minStock < 0) newErrors.minStock = 'Valid minimum stock is required'
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required'

    // Validate price relationships
    if (formData.sellingPrice > formData.mrp) {
      newErrors.sellingPrice = 'Selling price cannot be greater than MRP'
    }
    if (formData.purchasePrice > formData.sellingPrice) {
      newErrors.purchasePrice = 'Purchase price cannot be greater than selling price'
    }

    // Validate expiry date
    const expiryDate = new Date(formData.expiryDate)
    const today = new Date()
    if (expiryDate <= today) {
      newErrors.expiryDate = 'Expiry date must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const generateBarcode = () => {
    // Generate a simple barcode number
    const barcode = 'MED' + Date.now().toString().slice(-8)
    setFormData(prev => ({
      ...prev,
      batchNumber: barcode
    }))
  }

  return (
    <div className="medicine-form-overlay">
      <div className="medicine-form-modal">
        <div className="form-header">
          <div className="header-content">
            <Package size={24} />
            <h2>{medicine ? 'Edit Medicine' : 'Add New Medicine'}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="medicine-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Medicine Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="e.g., Paracetamol 500mg"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="composition">Composition (Salt Names) *</label>
                <input
                  type="text"
                  id="composition"
                  name="composition"
                  value={formData.composition}
                  onChange={handleInputChange}
                  className={errors.composition ? 'error' : ''}
                  placeholder="e.g., Paracetamol"
                />
                {errors.composition && <span className="error-text">{errors.composition}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="brand">Brand *</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className={errors.brand ? 'error' : ''}
                    placeholder="e.g., Crocin"
                  />
                  {errors.brand && <span className="error-text">{errors.brand}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="manufacturer">Manufacturer *</label>
                  <input
                    type="text"
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    className={errors.manufacturer ? 'error' : ''}
                    placeholder="e.g., GSK"
                  />
                  {errors.manufacturer && <span className="error-text">{errors.manufacturer}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    <option value="analgesic">Analgesic</option>
                    <option value="antibiotic">Antibiotic</option>
                    <option value="antacid">Antacid</option>
                    <option value="vitamin">Vitamin</option>
                    <option value="cough_cold">Cough & Cold</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="unit">Unit</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                  >
                    <option value="tablets">Tablets</option>
                    <option value="capsules">Capsules</option>
                    <option value="ml">ML</option>
                    <option value="bottles">Bottles</option>
                    <option value="strips">Strips</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Batch & Expiry Information */}
            <div className="form-section">
              <h3>Batch & Expiry Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="batchNumber">Batch Number *</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      id="batchNumber"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                      className={errors.batchNumber ? 'error' : ''}
                      placeholder="e.g., PCM001"
                    />
                    <button type="button" className="generate-btn" onClick={generateBarcode}>
                      <Scan size={16} />
                    </button>
                  </div>
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
            </div>

            {/* Pricing Information */}
            <div className="form-section">
              <h3>Pricing Information</h3>

              <div className="form-row">
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

                <div className="form-group">
                  <label htmlFor="mrp">MRP (₹) *</label>
                  <input
                    type="number"
                    id="mrp"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    className={errors.mrp ? 'error' : ''}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  {errors.mrp && <span className="error-text">{errors.mrp}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="sellingPrice">Selling Price (₹) *</label>
                  <input
                    type="number"
                    id="sellingPrice"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    className={errors.sellingPrice ? 'error' : ''}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  {errors.sellingPrice && <span className="error-text">{errors.sellingPrice}</span>}
                </div>
              </div>
            </div>

            {/* Stock Information */}
            <div className="form-section">
              <h3>Stock Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stock">Current Stock *</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className={errors.stock ? 'error' : ''}
                    placeholder="0"
                    min="0"
                  />
                  {errors.stock && <span className="error-text">{errors.stock}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="minStock">Minimum Stock Level *</label>
                  <input
                    type="number"
                    id="minStock"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    className={errors.minStock ? 'error' : ''}
                    placeholder="0"
                    min="0"
                  />
                  {errors.minStock && <span className="error-text">{errors.minStock}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="supplier">Supplier/Vendor *</label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className={errors.supplier ? 'error' : ''}
                  placeholder="e.g., MedSupply Co."
                />
                {errors.supplier && <span className="error-text">{errors.supplier}</span>}
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h3>Additional Information</h3>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Additional notes about the medicine..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="storageConditions">Storage Conditions</label>
                  <select
                    id="storageConditions"
                    name="storageConditions"
                    value={formData.storageConditions}
                    onChange={handleInputChange}
                  >
                    <option value="room_temperature">Room Temperature</option>
                    <option value="refrigerated">Refrigerated (2-8°C)</option>
                    <option value="frozen">Frozen (-20°C)</option>
                    <option value="cool_dry">Cool & Dry Place</option>
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="prescriptionRequired"
                      checked={formData.prescriptionRequired}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Prescription Required
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              {medicine ? 'Update Medicine' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MedicineForm
