import { useState } from 'react'
import { 
  BarChart3, 
  Download, 
  Calendar, 
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText
} from 'lucide-react'

const InventoryReports = () => {
  const [reportType, setReportType] = useState('valuation')
  const [dateRange, setDateRange] = useState('month')

  // Sample report data
  const reportData = {
    valuation: {
      totalCostValue: 845680.50,
      totalMRPValue: 1203450.75,
      totalSellingValue: 1083105.68,
      profitMargin: 28.1,
      categories: [
        { name: 'Analgesics', costValue: 125000, mrpValue: 175000, items: 45 },
        { name: 'Antibiotics', costValue: 200000, mrpValue: 280000, items: 32 },
        { name: 'Vitamins', costValue: 85000, mrpValue: 120000, items: 28 },
        { name: 'Cough & Cold', costValue: 65000, mrpValue: 95000, items: 22 }
      ]
    },
    fastMoving: [
      { name: 'Paracetamol 500mg', soldUnits: 450, revenue: 26100, trend: 'up' },
      { name: 'Amoxicillin 250mg', soldUnits: 320, revenue: 34560, trend: 'up' },
      { name: 'Vitamin D3', soldUnits: 280, revenue: 16800, trend: 'up' },
      { name: 'Cough Syrup', soldUnits: 150, revenue: 18225, trend: 'down' }
    ],
    slowMoving: [
      { name: 'Rare Medicine A', soldUnits: 5, revenue: 1250, daysInStock: 180 },
      { name: 'Specialty Drug B', soldUnits: 8, revenue: 3200, daysInStock: 150 },
      { name: 'Imported Medicine C', soldUnits: 12, revenue: 4800, daysInStock: 120 }
    ],
    deadStock: [
      { name: 'Old Formula X', value: 15000, daysInStock: 200, lastSale: '2023-08-15' },
      { name: 'Discontinued Y', value: 8500, daysInStock: 220, lastSale: '2023-07-20' },
      { name: 'Expired Batch Z', value: 5200, daysInStock: 250, lastSale: '2023-06-10' }
    ]
  }

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

  const renderValuationReport = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem' 
      }}>
        {[
          { label: 'Total Cost Value', value: formatCurrency(reportData.valuation.totalCostValue), icon: DollarSign, color: 'var(--primary-color)' },
          { label: 'Total MRP Value', value: formatCurrency(reportData.valuation.totalMRPValue), icon: TrendingUp, color: 'var(--secondary-color)' },
          { label: 'Total Selling Value', value: formatCurrency(reportData.valuation.totalSellingValue), icon: BarChart3, color: 'var(--accent-color)' },
          { label: 'Profit Margin', value: `${reportData.valuation.profitMargin}%`, icon: TrendingUp, color: 'var(--secondary-color)' }
        ].map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} style={{
              background: 'var(--bg-primary)',
              padding: '1.5rem',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: `${stat.color}20`,
                color: stat.color
              }}>
                <IconComponent size={24} />
              </div>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {stat.label}
                </p>
                <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {stat.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Category Breakdown */}
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Category-wise Valuation</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Items</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Cost Value</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>MRP Value</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Margin</th>
              </tr>
            </thead>
            <tbody>
              {reportData.valuation.categories.map((category, index) => {
                const margin = ((category.mrpValue - category.costValue) / category.costValue * 100).toFixed(1)
                return (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{category.name}</td>
                    <td style={{ padding: '1rem' }}>{category.items}</td>
                    <td style={{ padding: '1rem' }}>{formatCurrency(category.costValue)}</td>
                    <td style={{ padding: '1rem' }}>{formatCurrency(category.mrpValue)}</td>
                    <td style={{ padding: '1rem', color: 'var(--secondary-color)', fontWeight: 600 }}>{margin}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderMovementReport = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      {/* Fast Moving */}
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} style={{ color: 'var(--secondary-color)' }} />
            Fast Moving Products
          </h3>
        </div>
        <div style={{ padding: '1rem' }}>
          {reportData.fastMoving.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: index < reportData.fastMoving.length - 1 ? '1px solid var(--border-color)' : 'none'
            }}>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontWeight: 500, fontSize: '0.875rem' }}>{item.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.soldUnits} units sold</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: 'var(--secondary-color)' }}>
                  {formatCurrency(item.revenue)}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                  {item.trend === 'up' ? 
                    <TrendingUp size={12} style={{ color: 'var(--secondary-color)' }} /> :
                    <TrendingDown size={12} style={{ color: '#ef4444' }} />
                  }
                  <span style={{ fontSize: '0.75rem', color: item.trend === 'up' ? 'var(--secondary-color)' : '#ef4444' }}>
                    {item.trend === 'up' ? 'Rising' : 'Declining'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slow Moving */}
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingDown size={20} style={{ color: 'var(--accent-color)' }} />
            Slow Moving Products
          </h3>
        </div>
        <div style={{ padding: '1rem' }}>
          {reportData.slowMoving.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: index < reportData.slowMoving.length - 1 ? '1px solid var(--border-color)' : 'none'
            }}>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontWeight: 500, fontSize: '0.875rem' }}>{item.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.soldUnits} units in {item.daysInStock} days</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--accent-color)' }}>
                  {formatCurrency(item.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDeadStockReport = () => (
    <div style={{
      background: 'var(--bg-primary)',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} style={{ color: '#ef4444' }} />
          Dead Stock Report (6+ months)
        </h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Medicine</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Value</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Days in Stock</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Last Sale</th>
            </tr>
          </thead>
          <tbody>
            {reportData.deadStock.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{item.name}</td>
                <td style={{ padding: '1rem', color: '#ef4444', fontWeight: 600 }}>{formatCurrency(item.value)}</td>
                <td style={{ padding: '1rem' }}>{item.daysInStock} days</td>
                <td style={{ padding: '1rem' }}>{new Date(item.lastSale).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderReportContent = () => {
    switch (reportType) {
      case 'valuation':
        return renderValuationReport()
      case 'movement':
        return renderMovementReport()
      case 'deadstock':
        return renderDeadStockReport()
      default:
        return renderValuationReport()
    }
  }

  return (
    <div className="inventory-reports" style={{ padding: '2rem' }}>
      <div className="reports-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '2rem',
        gap: '2rem'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Inventory Reports
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
            Comprehensive inventory analysis and insights
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              background: 'var(--bg-secondary)'
            }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--border-radius)',
        padding: '0.5rem',
        marginBottom: '2rem',
        border: '1px solid var(--border-color)',
        gap: '0.25rem'
      }}>
        {[
          { id: 'valuation', label: 'Inventory Valuation', icon: DollarSign },
          { id: 'movement', label: 'Product Movement', icon: TrendingUp },
          { id: 'deadstock', label: 'Dead Stock', icon: AlertTriangle }
        ].map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: reportType === tab.id ? 'var(--primary-color)' : 'none',
                color: reportType === tab.id ? 'white' : 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                borderRadius: 'calc(var(--border-radius) - 2px)',
                transition: 'var(--transition)',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              <IconComponent size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  )
}

export default InventoryReports
