import { useState } from 'react'
import StockOverview from './stock/StockOverview'
import './StockManagement.css'

const StockManagementTest = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StockOverview />
      default:
        return <div>Test Component</div>
    }
  }

  return (
    <div className="stock-management">
      <div className="stock-header">
        <h1>Stock Management Test</h1>
        <p>Testing individual components</p>
      </div>

      <div className="stock-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Stock Overview
        </button>
      </div>

      <div className="stock-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default StockManagementTest
