import { useState } from 'react'
import { 
  Activity, 
  Plus, 
  Minus,
  AlertTriangle, 
  BarChart3,
  Search,
  RefreshCw,
  ArrowUpDown,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign
} from 'lucide-react'
import StockOverview from './stock/StockOverview'
import StockAdjustment from './stock/StockAdjustment'
import LowStockAlerts from './stock/LowStockAlerts'
import StockTransfer from './stock/StockTransfer'
import StockReports from './stock/StockReports'
import StockHistory from './stock/StockHistory'
import './StockManagement.css'

const StockManagement = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showStockAdjustment, setShowStockAdjustment] = useState(false)
  const [showStockTransfer, setShowStockTransfer] = useState(false)
  const [adjustmentType, setAdjustmentType] = useState('add') // 'add' or 'reduce'

  const tabs = [
    { id: 'overview', label: 'Stock Overview', icon: Package },
    { id: 'alerts', label: 'Low Stock Alerts', icon: AlertTriangle },
    { id: 'history', label: 'Stock History', icon: Clock },
    { id: 'transfer', label: 'Stock Transfer', icon: ArrowUpDown },
    { id: 'reports', label: 'Stock Reports', icon: BarChart3 },
  ]

  const stats = [
    {
      title: 'Total Stock Value',
      value: '₹12,45,680',
      change: '+8.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Items in Stock',
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
      title: 'Out of Stock',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: TrendingDown,
      color: 'red'
    }
  ]

  const handleStockAdd = () => {
    setAdjustmentType('add')
    setShowStockAdjustment(true)
  }

  const handleStockReduce = () => {
    setAdjustmentType('reduce')
    setShowStockAdjustment(true)
  }

  const handleCloseAdjustment = () => {
    setShowStockAdjustment(false)
  }

  const handleCloseTransfer = () => {
    setShowStockTransfer(false)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <StockOverview 
            onStockAdd={handleStockAdd}
            onStockReduce={handleStockReduce}
            onStockTransfer={() => setShowStockTransfer(true)}
          />
        )
      case 'alerts':
        return <LowStockAlerts />
      case 'history':
        return <StockHistory />
      case 'transfer':
        return <StockTransfer />
      case 'reports':
        return <StockReports />
      default:
        return <StockOverview onStockAdd={handleStockAdd} onStockReduce={handleStockReduce} />
    }
  }

  return (
    <div className="stock-management">
      <div className="stock-header">
        <div className="header-content">
          <h1>Stock Management</h1>
          <p>Real-time stock tracking, alerts, and management</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowStockTransfer(true)}
          >
            <ArrowUpDown size={20} />
            Transfer Stock
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleStockReduce}
          >
            <Minus size={20} />
            Reduce Stock
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleStockAdd}
          >
            <Plus size={20} />
            Add Stock
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stock-stats">
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
                  {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="stock-tabs">
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

      {/* Stock Adjustment Modal */}
      {showStockAdjustment && (
        <StockAdjustment
          type={adjustmentType}
          onClose={handleCloseAdjustment}
          onSave={handleCloseAdjustment}
        />
      )}

      {/* Stock Transfer Modal */}
      {showStockTransfer && (
        <StockTransfer
          onClose={handleCloseTransfer}
          onSave={handleCloseTransfer}
          isModal={true}
        />
      )}
    </div>
  )
}

export default StockManagement
