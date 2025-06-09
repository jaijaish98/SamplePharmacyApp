import { useState } from 'react'
import {
  BarChart3,
  Download,
  Calendar,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  FileText
} from 'lucide-react'
import './StockReports.css'

const StockReports = () => {
  const [reportType, setReportType] = useState('daily')
  const [dateRange, setDateRange] = useState('today')

  // Sample report data
  const reportData = {
    daily: {
      openingStock: {
        totalItems: 1247,
        totalValue: 1245680.50,
        categories: [
          { name: 'Analgesics', items: 45, value: 125000 },
          { name: 'Antibiotics', items: 32, value: 200000 },
          { name: 'Vitamins', items: 28, value: 85000 }
        ]
      },
      closingStock: {
        totalItems: 1235,
        totalValue: 1238450.75,
        categories: [
          { name: 'Analgesics', items: 43, value: 122500 },
          { name: 'Antibiotics', items: 31, value: 195000 },
          { name: 'Vitamins', items: 28, value: 85000 }
        ]
      },
      movements: {
        additions: 25,
        reductions: 37,
        transfers: 8,
        adjustments: 3
      }
    },
    itemWise: [
      {
        name: 'Paracetamol 500mg',
        openingStock: 50,
        additions: 100,
        reductions: 15,
        closingStock: 135,
        value: 6750.00,
        movements: 5
      },
      {
        name: 'Amoxicillin 250mg',
        openingStock: 30,
        additions: 0,
        reductions: 5,
        closingStock: 25,
        value: 2125.00,
        movements: 3
      },
      {
        name: 'Vitamin D3 1000IU',
        openingStock: 190,
        additions: 0,
        reductions: 0,
        closingStock: 190,
        value: 11400.00,
        movements: 1
      }
    ],
    summary: {
      totalStockValue: 1238450.75,
      lowStockItems: 23,
      outOfStockItems: 8,
      nearExpiryItems: 12,
      totalMovements: 73,
      averageDailyMovement: 24.3
    }
  }

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

  const renderDailyReport = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Opening vs Closing Stock */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem' 
      }}>
        {/* Opening Stock */}
        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '1.5rem', 
            borderBottom: '1px solid var(--border-color)', 
            background: 'rgba(16, 185, 129, 0.1)' 
          }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--secondary-color)' }}>
              Opening Stock
            </h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {reportData.daily.openingStock.totalItems}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Items</div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--secondary-color)' }}>
                {formatCurrency(reportData.daily.openingStock.totalValue)}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Value</div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: 600 }}>By Category</h4>
              {reportData.daily.openingStock.categories.map((cat, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <span>{cat.name}</span>
                  <span style={{ fontWeight: 500 }}>{cat.items} items</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing Stock */}
        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '1.5rem', 
            borderBottom: '1px solid var(--border-color)', 
            background: 'rgba(37, 99, 235, 0.1)' 
          }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-color)' }}>
              Closing Stock
            </h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {reportData.daily.closingStock.totalItems}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Items</div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                {formatCurrency(reportData.daily.closingStock.totalValue)}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Value</div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: 600 }}>By Category</h4>
              {reportData.daily.closingStock.categories.map((cat, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <span>{cat.name}</span>
                  <span style={{ fontWeight: 500 }}>{cat.items} items</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Movements */}
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Stock Movements</h3>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem' 
          }}>
            {[
              { label: 'Additions', value: reportData.daily.movements.additions, color: 'var(--secondary-color)', icon: TrendingUp },
              { label: 'Reductions', value: reportData.daily.movements.reductions, color: '#ef4444', icon: TrendingDown },
              { label: 'Transfers', value: reportData.daily.movements.transfers, color: 'var(--primary-color)', icon: Activity },
              { label: 'Adjustments', value: reportData.daily.movements.adjustments, color: 'var(--accent-color)', icon: Package }
            ].map((movement, index) => {
              const IconComponent = movement.icon
              return (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    background: `${movement.color}20`,
                    color: movement.color,
                    marginBottom: '0.5rem'
                  }}>
                    <IconComponent size={20} />
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: movement.color }}>
                    {movement.value}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {movement.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  const renderItemWiseReport = () => (
    <div style={{
      background: 'var(--bg-primary)',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Item-wise Stock Report</h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Medicine</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Opening Stock</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Additions</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Reductions</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Closing Stock</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Value</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Movements</th>
            </tr>
          </thead>
          <tbody>
            {reportData.itemWise.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{item.name}</td>
                <td style={{ padding: '1rem' }}>{item.openingStock}</td>
                <td style={{ padding: '1rem', color: 'var(--secondary-color)', fontWeight: 600 }}>
                  +{item.additions}
                </td>
                <td style={{ padding: '1rem', color: '#ef4444', fontWeight: 600 }}>
                  -{item.reductions}
                </td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{item.closingStock}</td>
                <td style={{ padding: '1rem', color: 'var(--secondary-color)', fontWeight: 600 }}>
                  {formatCurrency(item.value)}
                </td>
                <td style={{ padding: '1rem' }}>{item.movements}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderSummaryReport = () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '1rem' 
    }}>
      {[
        { label: 'Total Stock Value', value: formatCurrency(reportData.summary.totalStockValue), icon: DollarSign, color: 'var(--secondary-color)' },
        { label: 'Low Stock Items', value: reportData.summary.lowStockItems, icon: Package, color: 'var(--accent-color)' },
        { label: 'Out of Stock Items', value: reportData.summary.outOfStockItems, icon: Package, color: '#ef4444' },
        { label: 'Near Expiry Items', value: reportData.summary.nearExpiryItems, icon: Calendar, color: 'var(--accent-color)' },
        { label: 'Total Movements', value: reportData.summary.totalMovements, icon: Activity, color: 'var(--primary-color)' },
        { label: 'Avg Daily Movement', value: reportData.summary.averageDailyMovement.toFixed(1), icon: TrendingUp, color: 'var(--secondary-color)' }
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
  )

  const renderReportContent = () => {
    switch (reportType) {
      case 'daily':
        return renderDailyReport()
      case 'itemwise':
        return renderItemWiseReport()
      case 'summary':
        return renderSummaryReport()
      default:
        return renderDailyReport()
    }
  }

  return (
    <div className="stock-reports" style={{ padding: '2rem' }}>
      <div className="reports-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '2rem',
        gap: '2rem'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Stock Reports
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
            Comprehensive stock analysis and reporting
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
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
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
          { id: 'daily', label: 'Daily Stock', icon: Calendar },
          { id: 'itemwise', label: 'Item-wise Report', icon: Package },
          { id: 'summary', label: 'Stock Summary', icon: BarChart3 }
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

export default StockReports
