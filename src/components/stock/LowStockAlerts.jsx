import { useState } from 'react'
import {
  AlertTriangle,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Bell,
  BellOff,
  Search,
  Filter
} from 'lucide-react'
import './LowStockAlerts.css'

const LowStockAlerts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [showSettings, setShowSettings] = useState(false)

  // Sample low stock data
  const lowStockItems = [
    {
      id: 1,
      name: 'Amoxicillin 250mg',
      brand: 'Amoxil',
      category: 'Antibiotic',
      currentStock: 25,
      reorderLevel: 30,
      maxStock: 200,
      suggestedOrder: 175,
      supplier: 'PharmaCorp',
      lastOrderDate: '2024-02-10',
      avgDailySales: 5,
      daysUntilStockOut: 5,
      priority: 'high',
      alertEnabled: true
    },
    {
      id: 2,
      name: 'Cough Syrup 100ml',
      brand: 'Benadryl',
      category: 'Cough & Cold',
      currentStock: 15,
      reorderLevel: 25,
      maxStock: 100,
      suggestedOrder: 85,
      supplier: 'MedSupply Co.',
      lastOrderDate: '2024-02-05',
      avgDailySales: 3,
      daysUntilStockOut: 5,
      priority: 'medium',
      alertEnabled: true
    },
    {
      id: 3,
      name: 'Insulin Pen',
      brand: 'NovoRapid',
      category: 'Diabetes',
      currentStock: 8,
      reorderLevel: 15,
      maxStock: 50,
      suggestedOrder: 42,
      supplier: 'DiabetesCare',
      lastOrderDate: '2024-01-28',
      avgDailySales: 2,
      daysUntilStockOut: 4,
      priority: 'critical',
      alertEnabled: true
    },
    {
      id: 4,
      name: 'Vitamin B12 Tablets',
      brand: 'HealthVit',
      category: 'Vitamin',
      currentStock: 35,
      reorderLevel: 40,
      maxStock: 200,
      suggestedOrder: 165,
      supplier: 'VitaCorp',
      lastOrderDate: '2024-02-01',
      avgDailySales: 4,
      daysUntilStockOut: 9,
      priority: 'low',
      alertEnabled: false
    }
  ]

  const filteredItems = lowStockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === 'all') return matchesSearch
    if (filterBy === 'critical') return matchesSearch && item.priority === 'critical'
    if (filterBy === 'high') return matchesSearch && item.priority === 'high'
    if (filterBy === 'medium') return matchesSearch && item.priority === 'medium'
    if (filterBy === 'low') return matchesSearch && item.priority === 'low'
    
    return matchesSearch
  })

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      critical: { label: 'Critical', class: 'priority-critical', color: '#ef4444' },
      high: { label: 'High', class: 'priority-high', color: '#f59e0b' },
      medium: { label: 'Medium', class: 'priority-medium', color: '#3b82f6' },
      low: { label: 'Low', class: 'priority-low', color: '#10b981' }
    }
    return priorityMap[priority] || priorityMap.low
  }

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`

  const generatePurchaseOrder = (item) => {
    console.log('Generating purchase order for:', item.name)
    // Implement purchase order generation
  }

  const toggleAlert = (itemId) => {
    console.log('Toggling alert for item:', itemId)
    // Implement alert toggle
  }

  return (
    <div className="low-stock-alerts" style={{ padding: '2rem' }}>
      <div className="alerts-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '2rem',
        gap: '2rem'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Low Stock Alerts
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
            Monitor and manage items that need reordering
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={18} />
            Alert Settings
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        {[
          { label: 'Critical Items', count: lowStockItems.filter(i => i.priority === 'critical').length, color: '#ef4444' },
          { label: 'High Priority', count: lowStockItems.filter(i => i.priority === 'high').length, color: '#f59e0b' },
          { label: 'Medium Priority', count: lowStockItems.filter(i => i.priority === 'medium').length, color: '#3b82f6' },
          { label: 'Total Alerts', count: lowStockItems.filter(i => i.alertEnabled).length, color: '#10b981' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'var(--bg-primary)',
            padding: '1.5rem',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border-color)',
            borderLeft: `4px solid ${stat.color}`
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {stat.label}
            </h4>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '320px' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-light)',
            zIndex: 2,
            pointerEvents: 'none',
            width: '18px',
            height: '18px'
          }} />
          <input
            type="text"
            placeholder="Search medicines, brands, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.875rem 1rem 0.875rem 3.75rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              fontSize: '0.875rem',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.875rem',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Alerts Table */}
      <div style={{ 
        background: 'var(--bg-primary)', 
        borderRadius: 'var(--border-radius)', 
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Medicine</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Current Stock</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Reorder Level</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Days Until Out</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Suggested Order</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const priorityInfo = getPriorityInfo(item.priority)
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Package size={16} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {item.brand} • {item.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        fontWeight: 600, 
                        color: item.currentStock <= item.reorderLevel ? '#ef4444' : 'var(--text-primary)' 
                      }}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{item.reorderLevel}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        fontWeight: 600, 
                        color: item.daysUntilStockOut <= 3 ? '#ef4444' : item.daysUntilStockOut <= 7 ? '#f59e0b' : 'var(--text-primary)' 
                      }}>
                        {item.daysUntilStockOut} days
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--secondary-color)' }}>
                        {item.suggestedOrder}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: `${priorityInfo.color}20`,
                        color: priorityInfo.color
                      }}>
                        {priorityInfo.label}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => generatePurchaseOrder(item)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '0.375rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: 'var(--secondary-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Generate Purchase Order"
                        >
                          <ShoppingCart size={14} />
                        </button>
                        <button
                          onClick={() => toggleAlert(item.id)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '0.375rem',
                            background: item.alertEnabled ? 'rgba(245, 158, 11, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                            color: item.alertEnabled ? 'var(--accent-color)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title={item.alertEnabled ? 'Disable Alert' : 'Enable Alert'}
                        >
                          {item.alertEnabled ? <Bell size={14} /> : <BellOff size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '4rem 2rem',
          textAlign: 'center',
          color: 'var(--text-light)'
        }}>
          <AlertTriangle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>
            No low stock alerts found
          </h3>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            All items are above their reorder levels
          </p>
        </div>
      )}
    </div>
  )
}

export default LowStockAlerts
