import { useState } from 'react'
import StockOverview from './stock/StockOverview'
import StockAdjustment from './stock/StockAdjustment'
import LowStockAlerts from './stock/LowStockAlerts'
import StockTransfer from './stock/StockTransfer'
import StockReports from './stock/StockReports'
import StockHistory from './stock/StockHistory'
import './StockManagement.css'

const StockManagementSimple = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StockOverview />
      case 'adjustment':
        return <StockAdjustment />
      case 'alerts':
        return <LowStockAlerts />
      default:
        return <div>Coming Soon</div>
    }
  }

  return (
    <div className="stock-management">
      <div className="stock-header">
        <h1>Stock Management</h1>
        <p>Manage your pharmacy's stock levels and inventory</p>
      </div>

      <div className="stock-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Stock Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'adjustment' ? 'active' : ''}`}
          onClick={() => setActiveTab('adjustment')}
        >
          Stock Adjustment
        </button>
        <button
          className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Low Stock Alerts
        </button>
      </div>

      <div className="stock-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default StockManagementSimple
