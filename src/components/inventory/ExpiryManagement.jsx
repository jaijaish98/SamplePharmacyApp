import { useState } from 'react'
import { 
  AlertTriangle, 
  Calendar, 
  Package, 
  Clock,
  Download,
  Filter,
  Search
} from 'lucide-react'

const ExpiryManagement = () => {
  const [alertWindow, setAlertWindow] = useState(30) // days
  const [filterBy, setFilterBy] = useState('all')

  // Sample expiry data
  const expiryData = [
    {
      id: 1,
      medicineName: 'Ibuprofen 400mg',
      batchNumber: 'IBU003',
      expiryDate: '2024-03-20',
      quantity: 75,
      daysToExpiry: 15,
      status: 'critical',
      supplier: 'HealthMeds',
      purchaseValue: 2400.00
    },
    {
      id: 2,
      medicineName: 'Vitamin D3 Tablets',
      batchNumber: 'VIT001',
      expiryDate: '2024-04-15',
      quantity: 120,
      daysToExpiry: 41,
      status: 'warning',
      supplier: 'VitaCorp',
      purchaseValue: 3600.00
    },
    {
      id: 3,
      medicineName: 'Cough Syrup 100ml',
      batchNumber: 'CS005',
      expiryDate: '2024-05-10',
      quantity: 25,
      daysToExpiry: 66,
      status: 'caution',
      supplier: 'MedSupply Co.',
      purchaseValue: 2375.00
    }
  ]

  const getStatusInfo = (daysToExpiry) => {
    if (daysToExpiry <= 15) return { status: 'critical', color: '#ef4444', label: 'Critical' }
    if (daysToExpiry <= 30) return { status: 'warning', color: '#f59e0b', label: 'Warning' }
    if (daysToExpiry <= 90) return { status: 'caution', color: '#3b82f6', label: 'Caution' }
    return { status: 'safe', color: '#10b981', label: 'Safe' }
  }

  return (
    <div className="expiry-management" style={{ padding: '2rem' }}>
      <div className="expiry-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Expiry Management
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
            Monitor and manage medicine expiry dates
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Alert Settings */}
      <div style={{ 
        background: 'var(--bg-primary)', 
        padding: '1.5rem', 
        borderRadius: 'var(--border-radius)', 
        marginBottom: '2rem',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 600 }}>Alert Settings</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Alert Window:</label>
          <select 
            value={alertWindow} 
            onChange={(e) => setAlertWindow(e.target.value)}
            style={{ 
              padding: '0.5rem', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--border-radius)',
              background: 'var(--bg-secondary)'
            }}
          >
            <option value={15}>15 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Show medicines expiring within this period
          </span>
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
          { label: 'Critical (≤15 days)', count: 1, color: '#ef4444' },
          { label: 'Warning (≤30 days)', count: 2, color: '#f59e0b' },
          { label: 'Caution (≤90 days)', count: 3, color: '#3b82f6' },
          { label: 'Total Value at Risk', count: '₹8,375', color: '#6b7280' }
        ].map((item, index) => (
          <div key={index} style={{
            background: 'var(--bg-primary)',
            padding: '1.5rem',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border-color)',
            borderLeft: `4px solid ${item.color}`
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {item.label}
            </h4>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: item.color }}>
              {item.count}
            </p>
          </div>
        ))}
      </div>

      {/* Expiry Table */}
      <div style={{ 
        background: 'var(--bg-primary)', 
        borderRadius: 'var(--border-radius)', 
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Medicines Expiring Soon</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Medicine</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Batch</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Expiry Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Days Left</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Quantity</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Value</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {expiryData.map((item) => {
                const statusInfo = getStatusInfo(item.daysToExpiry)
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Package size={16} />
                        <span style={{ fontWeight: 500 }}>{item.medicineName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{item.batchNumber}</td>
                    <td style={{ padding: '1rem' }}>{new Date(item.expiryDate).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '1rem', color: statusInfo.color, fontWeight: 600 }}>
                      {item.daysToExpiry} days
                    </td>
                    <td style={{ padding: '1rem' }}>{item.quantity}</td>
                    <td style={{ padding: '1rem' }}>₹{item.purchaseValue.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: `${statusInfo.color}20`,
                        color: statusInfo.color
                      }}>
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ExpiryManagement
