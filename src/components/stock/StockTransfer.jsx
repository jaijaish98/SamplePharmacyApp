import { useState } from 'react';
import { ArrowUpDown, Package, MapPin, Send, History } from 'lucide-react';
import { format } from 'date-fns';
import { useStock } from '../../contexts/StockContext';

const StockTransfer = () => {
  const { stockItems, branches, loading } = useStock();
  const [transferData, setTransferData] = useState({
    fromBranch: 1, // Main branch
    toBranch: '',
    items: []
  });
  const [selectedItem, setSelectedItem] = useState('');
  const [transferQuantity, setTransferQuantity] = useState('');
  const [transferring, setTransferring] = useState(false);

  // Mock transfer history
  const transferHistory = [
    {
      id: 'TRF001',
      date: new Date(),
      fromBranch: 'Main Branch',
      toBranch: 'Branch 1',
      items: [
        { name: 'Paracetamol 500mg', quantity: 50 },
        { name: 'Cough Syrup 100ml', quantity: 20 }
      ],
      status: 'Completed'
    },
    {
      id: 'TRF002',
      date: new Date(Date.now() - 86400000),
      fromBranch: 'Branch 2',
      toBranch: 'Main Branch',
      items: [
        { name: 'Insulin Pen', quantity: 10 }
      ],
      status: 'In Transit'
    }
  ];

  const handleAddItem = () => {
    if (!selectedItem || !transferQuantity) {
      alert('Please select an item and enter quantity');
      return;
    }

    const item = stockItems.find(i => i.id === parseInt(selectedItem));
    if (!item) return;

    if (parseInt(transferQuantity) > item.currentStock) {
      alert('Transfer quantity cannot exceed current stock');
      return;
    }

    const existingItemIndex = transferData.items.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...transferData.items];
      updatedItems[existingItemIndex].quantity = parseInt(transferQuantity);
      setTransferData(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Add new item
      setTransferData(prev => ({
        ...prev,
        items: [...prev.items, {
          id: item.id,
          name: item.name,
          currentStock: item.currentStock,
          quantity: parseInt(transferQuantity),
          costPrice: item.costPrice
        }]
      }));
    }

    setSelectedItem('');
    setTransferQuantity('');
  };

  const handleRemoveItem = (itemId) => {
    setTransferData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleSubmitTransfer = async () => {
    if (!transferData.toBranch || transferData.items.length === 0) {
      alert('Please select destination branch and add items');
      return;
    }

    setTransferring(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Stock transfer initiated successfully!');
      setTransferData({
        fromBranch: 1,
        toBranch: '',
        items: []
      });
    } catch (error) {
      alert('Failed to initiate transfer. Please try again.');
    } finally {
      setTransferring(false);
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

  const getTotalTransferValue = () => {
    return transferData.items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  };

  if (loading) {
    return (
      <div className="stock-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading stock transfer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-container">
      <div className="stock-section">
        <h3>Stock Transfer Between Branches</h3>
        <p>Transfer stock items between different pharmacy branches</p>
      </div>

      {/* Branch Selection */}
      <div className="stock-section">
        <h4>Select Branches</h4>
        <div className="branch-selection">
          <div className="branch-selector">
            <div className="branch-label">From Branch</div>
            <select
              value={transferData.fromBranch}
              onChange={(e) => setTransferData(prev => ({ ...prev, fromBranch: parseInt(e.target.value) }))}
              className="branch-select"
            >
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} - {branch.location}
                </option>
              ))}
            </select>
          </div>

          <div className="transfer-arrow">
            <ArrowUpDown size={24} />
          </div>

          <div className="branch-selector">
            <div className="branch-label">To Branch</div>
            <select
              value={transferData.toBranch}
              onChange={(e) => setTransferData(prev => ({ ...prev, toBranch: parseInt(e.target.value) }))}
              className="branch-select"
            >
              <option value="">Select destination branch</option>
              {branches.filter(branch => branch.id !== transferData.fromBranch).map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} - {branch.location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Item Selection */}
      <div className="stock-section">
        <h4>Add Items to Transfer</h4>
        <div className="item-addition">
          <div className="add-item-form">
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="item-select"
            >
              <option value="">Select item to transfer</option>
              {stockItems.filter(item => item.currentStock > 0).map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} (Stock: {item.currentStock})
                </option>
              ))}
            </select>

            <input
              type="number"
              value={transferQuantity}
              onChange={(e) => setTransferQuantity(e.target.value)}
              placeholder="Quantity"
              className="quantity-input"
              min="1"
            />

            <button 
              className="btn btn-primary"
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Items List */}
      {transferData.items.length > 0 && (
        <div className="stock-section">
          <h4>Items to Transfer</h4>
          <div className="transfer-items">
            {transferData.items.map((item) => (
              <div key={item.id} className="transfer-item">
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-details">
                    Available: {item.currentStock} | Transferring: {item.quantity}
                  </div>
                </div>
                <div className="item-value">
                  {formatCurrency(item.quantity * item.costPrice)}
                </div>
                <button 
                  className="btn btn-outline btn-small"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="transfer-summary">
            <div className="summary-item">
              <span>Total Items:</span>
              <span>{transferData.items.length}</span>
            </div>
            <div className="summary-item">
              <span>Total Quantity:</span>
              <span>{transferData.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="summary-item">
              <span>Total Value:</span>
              <span>{formatCurrency(getTotalTransferValue())}</span>
            </div>
          </div>

          <div className="transfer-actions">
            <button 
              className={`btn btn-primary ${transferring ? 'loading' : ''}`}
              onClick={handleSubmitTransfer}
              disabled={transferring}
            >
              <Send size={16} />
              {transferring ? 'Initiating Transfer...' : 'Initiate Transfer'}
            </button>
          </div>
        </div>
      )}

      {/* Transfer History */}
      <div className="stock-section">
        <h4>Recent Transfer History</h4>
        <div className="transfer-history">
          {transferHistory.map((transfer) => (
            <div key={transfer.id} className="transfer-history-item">
              <div className="transfer-header">
                <div className="transfer-id">{transfer.id}</div>
                <div className={`transfer-status ${transfer.status.toLowerCase().replace(' ', '-')}`}>
                  {transfer.status}
                </div>
              </div>

              <div className="transfer-details">
                <div className="transfer-route">
                  <MapPin size={14} />
                  <span>{transfer.fromBranch} → {transfer.toBranch}</span>
                </div>
                <div className="transfer-date">
                  {format(new Date(transfer.date), 'dd/MM/yyyy HH:mm')}
                </div>
              </div>

              <div className="transfer-items-summary">
                <div className="items-count">
                  {transfer.items.length} item(s):
                </div>
                <div className="items-list">
                  {transfer.items.map((item, index) => (
                    <span key={index}>
                      {item.name} ({item.quantity})
                      {index < transfer.items.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer Guidelines */}
      <div className="stock-section">
        <h4>Transfer Guidelines</h4>
        <div className="guidelines">
          <div className="guideline-item">
            <Package size={16} />
            <span>Ensure receiving branch has adequate storage space</span>
          </div>
          <div className="guideline-item">
            <ArrowUpDown size={16} />
            <span>Transfers are tracked and require confirmation at destination</span>
          </div>
          <div className="guideline-item">
            <History size={16} />
            <span>All transfers maintain complete audit trail</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTransfer;
