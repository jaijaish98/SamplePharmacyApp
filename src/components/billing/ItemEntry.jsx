import { useState } from 'react';
import { Search, Scan, Package, AlertTriangle, Plus } from 'lucide-react';
import { useStock } from '../../contexts/StockContext';
import { useBilling } from '../../contexts/BillingContext';

const ItemEntry = () => {
  const { stockItems } = useStock();
  const { addItemToBill } = useBilling();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState('');
  const [discount, setDiscount] = useState(0);

  // Filter items based on search term
  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.salt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 8); // Show only top 8 results

  const handleItemSearch = (value) => {
    setSearchTerm(value);
    setShowSearchResults(value.length > 0);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setCustomPrice(item.sellingPrice.toString());
    setSearchTerm(item.name);
    setShowSearchResults(false);
    setQuantity(1);
    setDiscount(0);
  };

  const handleAddToBill = () => {
    if (!selectedItem) {
      alert('Please select an item first');
      return;
    }

    if (quantity > selectedItem.currentStock) {
      alert(`Only ${selectedItem.currentStock} units available in stock`);
      return;
    }

    const unitPrice = parseFloat(customPrice) || selectedItem.sellingPrice;
    const discountAmount = (unitPrice * quantity * discount) / 100;
    const totalPrice = (unitPrice * quantity) - discountAmount;

    const billItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      brand: selectedItem.brand,
      batchNumber: selectedItem.batchNumber,
      expiryDate: selectedItem.expiryDate,
      mrp: selectedItem.mrp,
      quantity: quantity,
      unitPrice: unitPrice,
      discount: discountAmount,
      total: totalPrice,
      availableStock: selectedItem.currentStock
    };

    addItemToBill(billItem);
    
    // Reset form
    setSelectedItem(null);
    setSearchTerm('');
    setQuantity(1);
    setCustomPrice('');
    setDiscount(0);
  };

  const handleBarcodeScanner = () => {
    // In a real app, this would open barcode scanner
    alert('Barcode scanner functionality would be implemented here');
  };

  const getStockStatus = (item) => {
    if (item.isOutOfStock) {
      return { status: 'out-of-stock', label: 'Out of Stock', color: '#ef4444' };
    } else if (item.isLowStock) {
      return { status: 'low-stock', label: 'Low Stock', color: '#f59e0b' };
    } else {
      return { status: 'in-stock', label: 'In Stock', color: '#10b981' };
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

  return (
    <div className="item-entry">
      {/* Item Search */}
      <div className="item-search">
        <div className="search-input-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, salt, brand, category, or batch number..."
            value={searchTerm}
            onChange={(e) => handleItemSearch(e.target.value)}
            className="item-search-input"
          />
          <button 
            className="barcode-btn"
            onClick={handleBarcodeScanner}
            title="Scan Barcode"
          >
            <Scan size={16} />
          </button>
        </div>
        
        {showSearchResults && filteredItems.length > 0 && (
          <div className="search-results">
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(item);
              return (
                <div
                  key={item.id}
                  className={`search-result-item ${stockStatus.status}`}
                  onClick={() => handleItemSelect(item)}
                >
                  <div className="result-header">
                    <div className="result-name">{item.name}</div>
                    <div 
                      className="stock-indicator"
                      style={{ color: stockStatus.color }}
                    >
                      {stockStatus.label}
                    </div>
                  </div>
                  <div className="result-details">
                    <span>Brand: {item.brand}</span>
                    <span>Salt: {item.salt}</span>
                    <span>Batch: {item.batchNumber}</span>
                  </div>
                  <div className="result-pricing">
                    <span>MRP: {formatCurrency(item.mrp)}</span>
                    <span>Price: {formatCurrency(item.sellingPrice)}</span>
                    <span>Stock: {item.currentStock}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Item Details */}
      {selectedItem && (
        <div className="selected-item">
          <div className="item-details">
            <div className="item-header">
              <div className="item-name">{selectedItem.name}</div>
              <div className="item-brand">{selectedItem.brand}</div>
            </div>
            
            <div className="item-info-grid">
              <div className="info-item">
                <span className="info-label">Salt:</span>
                <span className="info-value">{selectedItem.salt}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Batch:</span>
                <span className="info-value">{selectedItem.batchNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Expiry:</span>
                <span className="info-value">
                  {new Date(selectedItem.expiryDate).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Available:</span>
                <span className="info-value">{selectedItem.currentStock} units</span>
              </div>
              <div className="info-item">
                <span className="info-label">MRP:</span>
                <span className="info-value">{formatCurrency(selectedItem.mrp)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location:</span>
                <span className="info-value">{selectedItem.location}</span>
              </div>
            </div>

            {/* Stock Warnings */}
            {selectedItem.isNearExpiry && (
              <div className="stock-warning expiry">
                <AlertTriangle size={14} />
                Expires in {selectedItem.daysToExpiry} days
              </div>
            )}
            
            {selectedItem.isLowStock && (
              <div className="stock-warning low-stock">
                <AlertTriangle size={14} />
                Low stock - only {selectedItem.currentStock} units left
              </div>
            )}
          </div>

          {/* Quantity and Pricing */}
          <div className="item-entry-form">
            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                  min="1"
                  max={selectedItem.currentStock}
                />
              </div>
              
              <div className="form-group">
                <label>Unit Price</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="price-input"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                  className="discount-input"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>

            {/* Price Calculation */}
            <div className="price-calculation">
              <div className="calc-row">
                <span>Subtotal:</span>
                <span>{formatCurrency((parseFloat(customPrice) || 0) * quantity)}</span>
              </div>
              {discount > 0 && (
                <div className="calc-row discount">
                  <span>Discount ({discount}%):</span>
                  <span>-{formatCurrency(((parseFloat(customPrice) || 0) * quantity * discount) / 100)}</span>
                </div>
              )}
              <div className="calc-row total">
                <span>Total:</span>
                <span>
                  {formatCurrency(
                    ((parseFloat(customPrice) || 0) * quantity) - 
                    (((parseFloat(customPrice) || 0) * quantity * discount) / 100)
                  )}
                </span>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleAddToBill}
              disabled={!selectedItem || quantity > selectedItem.currentStock}
            >
              <Plus size={16} />
              Add to Bill
            </button>
          </div>
        </div>
      )}

      {/* Quick Add Suggestions */}
      {!selectedItem && searchTerm.length === 0 && (
        <div className="quick-suggestions">
          <h4>Quick Add - Popular Items</h4>
          <div className="suggestion-grid">
            {stockItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="suggestion-item"
                onClick={() => handleItemSelect(item)}
              >
                <Package size={16} />
                <div className="suggestion-name">{item.name}</div>
                <div className="suggestion-price">{formatCurrency(item.sellingPrice)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemEntry;
