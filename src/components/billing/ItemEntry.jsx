import React, { useState } from 'react';
import {
  Search,
  Scan,
  Plus,
  Minus,
  Package,
  AlertTriangle,
  Calendar,
  Tag,
  Pill
} from 'lucide-react';
import './ItemEntry.css';

const ItemEntry = ({ medicines, onAddItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showScanner, setShowScanner] = useState(false);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.composition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = () => {
    if (selectedMedicine && quantity > 0) {
      if (quantity <= selectedMedicine.stock) {
        onAddItem(selectedMedicine, quantity);
        setSelectedMedicine(null);
        setQuantity(1);
        setSearchTerm('');
      } else {
        alert(`Only ${selectedMedicine.stock} units available in stock`);
      }
    }
  };

  const handleBarcodeScanner = () => {
    setShowScanner(true);
    // In a real implementation, this would open camera/barcode scanner
    // For demo, we'll simulate finding a medicine
    setTimeout(() => {
      const randomMedicine = medicines[Math.floor(Math.random() * medicines.length)];
      setSelectedMedicine(randomMedicine);
      setShowScanner(false);
    }, 2000);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'out-of-stock', text: 'Out of Stock', color: '#ef4444' };
    if (stock < 10) return { status: 'low-stock', text: 'Low Stock', color: '#f59e0b' };
    return { status: 'in-stock', text: 'In Stock', color: '#10b981' };
  };

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90; // Expiring within 3 months
  };

  return (
    <div className="item-entry">
      <div className="item-entry-header">
        <h3>Add Medicine</h3>
        <button 
          className="btn btn-outline btn-sm"
          onClick={handleBarcodeScanner}
          disabled={showScanner}
        >
          <Scan size={16} />
          {showScanner ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {/* Search Section */}
      <div className="medicine-search">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, brand, or composition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="medicine-results">
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map(medicine => {
              const stockStatus = getStockStatus(medicine.stock);
              const expiringSoon = isExpiringSoon(medicine.expiry);
              
              return (
                <div 
                  key={medicine.id} 
                  className={`medicine-result-item ${selectedMedicine?.id === medicine.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMedicine(medicine)}
                >
                  <div className="medicine-info">
                    <div className="medicine-header">
                      <h4>{medicine.name}</h4>
                      <div className="medicine-badges">
                        <span 
                          className={`stock-badge ${stockStatus.status}`}
                          style={{ color: stockStatus.color }}
                        >
                          {stockStatus.text}
                        </span>
                        {expiringSoon && (
                          <span className="expiry-badge">
                            <AlertTriangle size={12} />
                            Expiring Soon
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="medicine-details">
                      <p className="medicine-brand">
                        <Tag size={14} />
                        {medicine.brand}
                      </p>
                      <p className="medicine-composition">
                        <Pill size={14} />
                        {medicine.composition}
                      </p>
                      <p className="medicine-batch">
                        <Package size={14} />
                        Batch: {medicine.batchNo}
                      </p>
                      <p className="medicine-expiry">
                        <Calendar size={14} />
                        Exp: {new Date(medicine.expiry).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="medicine-pricing">
                      <div className="price-info">
                        <span className="mrp">MRP: ₹{medicine.mrp}</span>
                        <span className="selling-price">₹{medicine.sellingPrice}</span>
                      </div>
                      <div className="stock-info">
                        <span className="stock-count">{medicine.stock} units</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <Package size={48} />
              <p>No medicines found</p>
              <p>Try searching with different keywords</p>
            </div>
          )}
        </div>
      )}

      {/* Selected Medicine Details */}
      {selectedMedicine && (
        <div className="selected-medicine">
          <div className="selected-medicine-header">
            <h4>Selected Medicine</h4>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => setSelectedMedicine(null)}
            >
              Clear
            </button>
          </div>
          
          <div className="selected-medicine-info">
            <div className="medicine-summary">
              <h5>{selectedMedicine.name}</h5>
              <p>{selectedMedicine.brand} - {selectedMedicine.composition}</p>
              <div className="price-display">
                <span className="price">₹{selectedMedicine.sellingPrice}</span>
                <span className="mrp">MRP: ₹{selectedMedicine.mrp}</span>
              </div>
            </div>
            
            <div className="quantity-section">
              <label>Quantity</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                  min="1"
                  max={selectedMedicine.stock}
                />
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.min(selectedMedicine.stock, quantity + 1))}
                  disabled={quantity >= selectedMedicine.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="stock-available">
                {selectedMedicine.stock} available
              </span>
            </div>
            
            <div className="total-section">
              <div className="total-display">
                <span className="total-label">Total:</span>
                <span className="total-amount">
                  ₹{(selectedMedicine.sellingPrice * quantity).toFixed(2)}
                </span>
              </div>
              
              <button 
                className="btn btn-primary btn-add-to-cart"
                onClick={handleAddToCart}
                disabled={quantity > selectedMedicine.stock || selectedMedicine.stock === 0}
              >
                <Plus size={18} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="scanner-modal">
          <div className="scanner-content">
            <div className="scanner-animation">
              <Scan size={48} />
              <p>Scanning barcode...</p>
              <div className="scanner-line"></div>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => setShowScanner(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemEntry;
