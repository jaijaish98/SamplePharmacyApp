import { useState } from 'react';
import { Settings, Package, AlertTriangle, Save, Search } from 'lucide-react';
import { useStock } from '../../contexts/StockContext';

const StockAdjustment = () => {
  const { stockItems, adjustStock, loading } = useStock();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustmentData, setAdjustmentData] = useState({
    newQuantity: '',
    reason: '',
    notes: ''
  });
  const [adjusting, setAdjusting] = useState(false);

  const reasons = [
    'Damaged',
    'Expired',
    'Theft/Loss',
    'Found Extra Stock',
    'Counting Error',
    'Return from Customer',
    'Quality Issue',
    'Other'
  ];

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setAdjustmentData({
      newQuantity: item.currentStock.toString(),
      reason: '',
      notes: ''
    });
  };

  const handleAdjustmentChange = (field, value) => {
    setAdjustmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedItem || !adjustmentData.newQuantity || !adjustmentData.reason) {
      alert('Please fill all required fields');
      return;
    }

    setAdjusting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      adjustStock(
        selectedItem.id,
        parseInt(adjustmentData.newQuantity),
        adjustmentData.reason,
        adjustmentData.notes
      );

      alert('Stock adjustment completed successfully!');
      setSelectedItem(null);
      setAdjustmentData({ newQuantity: '', reason: '', notes: '' });
    } catch (error) {
      alert('Failed to adjust stock. Please try again.');
    } finally {
      setAdjusting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="stock-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading stock adjustment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-container">
      <div className="stock-section">
        <h3>Manual Stock Adjustment</h3>
        <p>Adjust stock quantities for damaged, expired, or miscounted items</p>
      </div>

      {/* Item Selection */}
      <div className="stock-section">
        <h4>Select Item to Adjust</h4>
        
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search items by name, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="item-selection-list">
          {filteredItems.slice(0, 10).map((item) => (
            <div 
              key={item.id} 
              className={`item-selection-card ${selectedItem?.id === item.id ? 'selected' : ''}`}
              onClick={() => handleItemSelect(item)}
            >
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-details">
                  Brand: {item.brand} | Category: {item.category} | Batch: {item.batchNumber}
                </div>
              </div>
              <div className="item-stock">
                <div className="current-stock">
                  Current Stock: <strong>{item.currentStock}</strong>
                </div>
                <div className="stock-value">
                  Value: {formatCurrency(item.currentStock * item.costPrice)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjustment Form */}
      {selectedItem && (
        <div className="stock-section">
          <h4>Adjust Stock for: {selectedItem.name}</h4>
          
          <div className="adjustment-form">
            <div className="current-stock-info">
              <div className="info-card">
                <div className="info-label">Current Stock</div>
                <div className="info-value">{selectedItem.currentStock} units</div>
              </div>
              <div className="info-card">
                <div className="info-label">Current Value</div>
                <div className="info-value">{formatCurrency(selectedItem.currentStock * selectedItem.costPrice)}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Reorder Level</div>
                <div className="info-value">{selectedItem.reorderLevel} units</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="adjustment-grid">
                <div className="form-group">
                  <label className="required">New Quantity</label>
                  <input
                    type="number"
                    value={adjustmentData.newQuantity}
                    onChange={(e) => handleAdjustmentChange('newQuantity', e.target.value)}
                    className="adjustment-input"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="required">Reason for Adjustment</label>
                  <select
                    value={adjustmentData.reason}
                    onChange={(e) => handleAdjustmentChange('reason', e.target.value)}
                    className="adjustment-input"
                    required
                  >
                    <option value="">Select reason</option>
                    {reasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group adjustment-notes">
                  <label>Additional Notes</label>
                  <textarea
                    value={adjustmentData.notes}
                    onChange={(e) => handleAdjustmentChange('notes', e.target.value)}
                    className="adjustment-input"
                    placeholder="Enter any additional details about the adjustment"
                    rows="3"
                  />
                </div>
              </div>

              {/* Adjustment Preview */}
              {adjustmentData.newQuantity && (
                <div className="adjustment-preview">
                  <h5>Adjustment Preview</h5>
                  <div className="preview-grid">
                    <div className="preview-item">
                      <span>Current Quantity:</span>
                      <span>{selectedItem.currentStock}</span>
                    </div>
                    <div className="preview-item">
                      <span>New Quantity:</span>
                      <span>{adjustmentData.newQuantity}</span>
                    </div>
                    <div className="preview-item">
                      <span>Difference:</span>
                      <span className={parseInt(adjustmentData.newQuantity) - selectedItem.currentStock >= 0 ? 'positive' : 'negative'}>
                        {parseInt(adjustmentData.newQuantity) - selectedItem.currentStock >= 0 ? '+' : ''}
                        {parseInt(adjustmentData.newQuantity) - selectedItem.currentStock}
                      </span>
                    </div>
                    <div className="preview-item">
                      <span>Value Impact:</span>
                      <span className={parseInt(adjustmentData.newQuantity) - selectedItem.currentStock >= 0 ? 'positive' : 'negative'}>
                        {formatCurrency((parseInt(adjustmentData.newQuantity) - selectedItem.currentStock) * selectedItem.costPrice)}
                      </span>
                    </div>
                  </div>

                  {parseInt(adjustmentData.newQuantity) <= selectedItem.reorderLevel && (
                    <div className="adjustment-warning">
                      <AlertTriangle size={16} />
                      Warning: New quantity is at or below reorder level ({selectedItem.reorderLevel})
                    </div>
                  )}
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedItem(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`btn btn-primary ${adjusting ? 'loading' : ''}`}
                  disabled={adjusting}
                >
                  <Save size={16} />
                  {adjusting ? 'Adjusting...' : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Adjustments */}
      <div className="stock-section">
        <h4>Recent Stock Adjustments</h4>
        <div className="recent-adjustments">
          <div className="adjustment-history-item">
            <div className="adjustment-info">
              <div className="adjustment-item">Paracetamol 500mg</div>
              <div className="adjustment-details">Adjusted from 45 to 40 units</div>
            </div>
            <div className="adjustment-meta">
              <div className="adjustment-reason">Reason: Damaged</div>
              <div className="adjustment-time">2 hours ago</div>
            </div>
          </div>
          
          <div className="adjustment-history-item">
            <div className="adjustment-info">
              <div className="adjustment-item">Cough Syrup 100ml</div>
              <div className="adjustment-details">Adjusted from 20 to 25 units</div>
            </div>
            <div className="adjustment-meta">
              <div className="adjustment-reason">Reason: Found Extra Stock</div>
              <div className="adjustment-time">1 day ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Adjustment Guidelines */}
      <div className="stock-section">
        <h4>Adjustment Guidelines</h4>
        <div className="guidelines">
          <div className="guideline-item">
            <Settings size={16} />
            <span>Always provide a clear reason for stock adjustments</span>
          </div>
          <div className="guideline-item">
            <Package size={16} />
            <span>Double-check quantities before submitting adjustments</span>
          </div>
          <div className="guideline-item">
            <AlertTriangle size={16} />
            <span>Large adjustments may require supervisor approval</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustment;
