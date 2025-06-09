import { useState } from 'react'
import { X, Scan, Camera, Type, Search } from 'lucide-react'
import './BarcodeScanner.css'

const BarcodeScanner = ({ onClose, onScan }) => {
  const [scanMode, setScanMode] = useState('camera') // 'camera' or 'manual'
  const [manualCode, setManualCode] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  // Sample barcode database for demonstration
  const barcodeDatabase = {
    '8901030895566': {
      name: 'Paracetamol 500mg',
      composition: 'Paracetamol',
      brand: 'Crocin',
      manufacturer: 'GSK',
      mrp: 65.00
    },
    '8901030895567': {
      name: 'Amoxicillin 250mg',
      composition: 'Amoxicillin',
      brand: 'Amoxil',
      manufacturer: 'Cipla',
      mrp: 120.00
    },
    '8901030895568': {
      name: 'Ibuprofen 400mg',
      composition: 'Ibuprofen',
      brand: 'Brufen',
      manufacturer: 'Abbott',
      mrp: 48.00
    }
  }

  const handleCameraScan = () => {
    setIsScanning(true)
    
    // Simulate camera scanning process
    setTimeout(() => {
      const sampleBarcodes = Object.keys(barcodeDatabase)
      const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)]
      const medicineData = barcodeDatabase[randomBarcode]
      
      setIsScanning(false)
      onScan({
        barcode: randomBarcode,
        ...medicineData
      })
    }, 2000)
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualCode.trim()) {
      const medicineData = barcodeDatabase[manualCode.trim()]
      if (medicineData) {
        onScan({
          barcode: manualCode.trim(),
          ...medicineData
        })
      } else {
        // If not found in database, still return the barcode
        onScan({
          barcode: manualCode.trim(),
          name: '',
          composition: '',
          brand: '',
          manufacturer: '',
          mrp: 0
        })
      }
    }
  }

  const handleQuickScan = (barcode) => {
    const medicineData = barcodeDatabase[barcode]
    onScan({
      barcode,
      ...medicineData
    })
  }

  return (
    <div className="barcode-scanner-overlay">
      <div className="barcode-scanner-modal">
        <div className="scanner-header">
          <div className="header-content">
            <Scan size={24} />
            <h2>Barcode Scanner</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="scanner-content">
          {/* Scan Mode Tabs */}
          <div className="scan-mode-tabs">
            <button
              className={`mode-tab ${scanMode === 'camera' ? 'active' : ''}`}
              onClick={() => setScanMode('camera')}
            >
              <Camera size={20} />
              Camera Scan
            </button>
            <button
              className={`mode-tab ${scanMode === 'manual' ? 'active' : ''}`}
              onClick={() => setScanMode('manual')}
            >
              <Type size={20} />
              Manual Entry
            </button>
          </div>

          {/* Camera Scan Mode */}
          {scanMode === 'camera' && (
            <div className="camera-scan-section">
              <div className="camera-preview">
                {isScanning ? (
                  <div className="scanning-animation">
                    <div className="scan-line"></div>
                    <div className="scanning-text">
                      <Scan size={48} />
                      <p>Scanning for barcode...</p>
                      <p className="scan-instruction">Hold the barcode steady in the frame</p>
                    </div>
                  </div>
                ) : (
                  <div className="camera-placeholder">
                    <Camera size={64} />
                    <p>Camera Preview</p>
                    <p className="camera-instruction">Position the barcode within the frame</p>
                  </div>
                )}
              </div>
              
              <div className="camera-controls">
                <button
                  className="btn btn-primary scan-btn"
                  onClick={handleCameraScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <div className="spinner"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan size={20} />
                      Start Scanning
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Manual Entry Mode */}
          {scanMode === 'manual' && (
            <div className="manual-entry-section">
              <form onSubmit={handleManualSubmit} className="manual-form">
                <div className="form-group">
                  <label htmlFor="manualCode">Enter Barcode Number</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      id="manualCode"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="e.g., 8901030895566"
                      className="barcode-input"
                    />
                    <button type="submit" className="btn btn-primary">
                      <Search size={18} />
                      Search
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Scan Options */}
              <div className="quick-scan-section">
                <h3>Quick Scan Options</h3>
                <p>Click on any barcode below to simulate scanning:</p>
                <div className="quick-scan-grid">
                  {Object.entries(barcodeDatabase).map(([barcode, medicine]) => (
                    <div
                      key={barcode}
                      className="quick-scan-item"
                      onClick={() => handleQuickScan(barcode)}
                    >
                      <div className="barcode-display">
                        <div className="barcode-lines">
                          <div className="line"></div>
                          <div className="line"></div>
                          <div className="line"></div>
                          <div className="line"></div>
                          <div className="line"></div>
                        </div>
                        <span className="barcode-number">{barcode}</span>
                      </div>
                      <div className="medicine-preview">
                        <h4>{medicine.name}</h4>
                        <p>{medicine.brand} - {medicine.manufacturer}</p>
                        <span className="price">MRP: ₹{medicine.mrp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="scanner-instructions">
            <h3>Instructions</h3>
            <ul>
              <li>Ensure the barcode is clean and clearly visible</li>
              <li>Hold the device steady while scanning</li>
              <li>Make sure there's adequate lighting</li>
              <li>If camera scan fails, try manual entry</li>
              <li>For testing, use the quick scan options below</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarcodeScanner
