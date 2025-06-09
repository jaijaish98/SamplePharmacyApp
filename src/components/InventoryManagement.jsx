import { useState } from 'react'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  BarChart3,
  Scan,
  Users,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react'
import MedicineList from './inventory/MedicineList'
import MedicineForm from './inventory/MedicineForm'
import BatchManagement from './inventory/BatchManagement'
import ExpiryManagement from './inventory/ExpiryManagement'
import SupplierManagement from './inventory/SupplierManagement'
import InventoryReports from './inventory/InventoryReports'
import BarcodeScanner from './inventory/BarcodeScanner'
import './InventoryManagement.css'

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('medicines')
  const [showMedicineForm, setShowMedicineForm] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState(null)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)

  const tabs = [
    { id: 'medicines', label: 'Medicines', icon: Package },
    { id: 'batches', label: 'Batch Management', icon: FileText },
    { id: 'expiry', label: 'Expiry Management', icon: AlertTriangle },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ]

  const stats = [
    {
      title: 'Total Medicines',
      value: '1,247',
      change: '+12',
      trend: 'up',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '-5',
      trend: 'down',
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      title: 'Expiring Soon',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Calendar,
      color: 'red'
    },
    {
      title: 'Inventory Value',
      value: '₹8,45,680',
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    }
  ]

  const handleAddMedicine = () => {
    setEditingMedicine(null)
    setShowMedicineForm(true)
  }

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine)
    setShowMedicineForm(true)
  }

  const handleCloseMedicineForm = () => {
    setShowMedicineForm(false)
    setEditingMedicine(null)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'medicines':
        return (
          <MedicineList 
            onAddMedicine={handleAddMedicine}
            onEditMedicine={handleEditMedicine}
            onScanBarcode={() => setShowBarcodeScanner(true)}
          />
        )
      case 'batches':
        return <BatchManagement />
      case 'expiry':
        return <ExpiryManagement />
      case 'suppliers':
        return <SupplierManagement />
      case 'reports':
        return <InventoryReports />
      default:
        return <MedicineList onAddMedicine={handleAddMedicine} onEditMedicine={handleEditMedicine} />
    }
  }

  return (
    <div className="inventory-management">
      <div className="inventory-header">
        <div className="header-content">
          <h1>Inventory Management</h1>
          <p>Manage your pharmacy's medicine inventory, batches, and suppliers</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowBarcodeScanner(true)}
          >
            <Scan size={20} />
            Scan Barcode
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleAddMedicine}
          >
            <Plus size={20} />
            Add Medicine
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="inventory-stats">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                <IconComponent size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.trend}`}>
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="inventory-tabs">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent size={20} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      {/* Medicine Form Modal */}
      {showMedicineForm && (
        <MedicineForm
          medicine={editingMedicine}
          onClose={handleCloseMedicineForm}
          onSave={handleCloseMedicineForm}
        />
      )}

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onClose={() => setShowBarcodeScanner(false)}
          onScan={(data) => {
            console.log('Scanned:', data)
            setShowBarcodeScanner(false)
          }}
        />
      )}
    </div>
  )
}

export default InventoryManagement
