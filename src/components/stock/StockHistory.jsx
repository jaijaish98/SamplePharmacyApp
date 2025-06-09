import { useState } from 'react'
import {
  Clock,
  Search,
  Filter,
  Calendar,
  User,
  Package,
  Plus,
  Minus,
  ArrowUpDown,
  Download
} from 'lucide-react'
import './StockHistory.css'

const StockHistory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [dateRange, setDateRange] = useState('week')

  // Sample stock history data
  const stockHistory = [
    {
      id: 1,
      timestamp: '2024-03-15 10:30 AM',
      medicine: 'Paracetamol 500mg',
      type: 'addition',
      quantity: 100,
      reason: 'New Purchase',
      user: 'Admin User',
      batchNumber: 'PCM001',
      supplier: 'MedSupply Co.',
      notes: 'Regular stock replenishment',
      previousStock: 50,
      newStock: 150
    },
    {
      id: 2,
      timestamp: '2024-03-15 09:15 AM',
      medicine: 'Amoxicillin 250mg',
      type: 'reduction',
      quantity: 5,
      reason: 'Sale',
      user: 'Pharmacist 1',
      batchNumber: 'AMX002',
      supplier: null,
      notes: 'Customer purchase',
      previousStock: 30,
      newStock: 25
    },
    {
      id: 3,
      timestamp: '2024-03-15 08:45 AM',
      medicine: 'Vitamin D3 1000IU',
      type: 'adjustment',
      quantity: 10,
      reason: 'Correction - Count Error',
      user: 'Admin User',
      batchNumber: 'VIT001',
      supplier: null,
      notes: 'Physical count correction',
      previousStock: 190,
      newStock: 200
    },
    {
      id: 4,
      timestamp: '2024-03-14 05:45 PM',
      medicine: 'Ibuprofen 400mg',
      type: 'reduction',
      quantity: 75,
      reason: 'Expiry',
      user: 'Pharmacist 2',
      batchNumber: 'IBU003',
      supplier: null,
      notes: 'Expired batch removed',
      previousStock: 75,
      newStock: 0
    },
    {
      id: 5,
      timestamp: '2024-03-14 02:30 PM',
      medicine: 'Cough Syrup 100ml',
      type: 'transfer',
      quantity: 10,
      reason: 'Transfer Out',
      user: 'Admin User',
      batchNumber: 'CS004',
      supplier: null,
      notes: 'Transfer to Branch 2',
      previousStock: 25,
      newStock: 15
    },
    {
      id: 6,
      timestamp: '2024-03-14 11:20 AM',
      medicine: 'Paracetamol 500mg',
      type: 'reduction',
      quantity: 3,
      reason: 'Damage',
      user: 'Pharmacist 1',
      batchNumber: 'PCM001',
      supplier: null,
      notes: 'Damaged during handling',
      previousStock: 53,
      newStock: 50
    }
  ]

  const filteredHistory = stockHistory.filter(entry => {
    const matchesSearch = entry.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === 'all') return matchesSearch
    if (filterBy === 'addition') return matchesSearch && entry.type === 'addition'
    if (filterBy === 'reduction') return matchesSearch && entry.type === 'reduction'
    if (filterBy === 'adjustment') return matchesSearch && entry.type === 'adjustment'
    if (filterBy === 'transfer') return matchesSearch && entry.type === 'transfer'
    
    return matchesSearch
  })

  const getTypeInfo = (type) => {
    const typeMap = {
      addition: { label: 'Addition', class: 'type-addition', icon: Plus, color: 'var(--secondary-color)' },
      reduction: { label: 'Reduction', class: 'type-reduction', icon: Minus, color: '#ef4444' },
      adjustment: { label: 'Adjustment', class: 'type-adjustment', icon: Package, color: 'var(--primary-color)' },
      transfer: { label: 'Transfer', class: 'type-transfer', icon: ArrowUpDown, color: 'var(--accent-color)' }
    }
    return typeMap[type] || typeMap.adjustment
  }

  const getStockChange = (entry) => {
    const change = entry.newStock - entry.previousStock
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral'
    }
  }

  return (
    <div className="stock-history" style={{ padding: '2rem' }}>
      <div className="history-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '2rem',
        gap: '2rem'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Stock History
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
            Track all stock movements and changes
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

      {/* Search and Filter */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
          <Search size={20} style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-light)' 
          }} />
          <input
            type="text"
            placeholder="Search medicines, users, or reasons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 3rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              fontSize: '0.875rem',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
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
          <option value="all">All Types</option>
          <option value="addition">Additions</option>
          <option value="reduction">Reductions</option>
          <option value="adjustment">Adjustments</option>
          <option value="transfer">Transfers</option>
        </select>
      </div>

      {/* History Timeline */}
      <div style={{ 
        background: 'var(--bg-primary)', 
        borderRadius: 'var(--border-radius)', 
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Recent Stock Movements</h3>
        </div>
        
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredHistory.map((entry, index) => {
            const typeInfo = getTypeInfo(entry.type)
            const TypeIcon = typeInfo.icon
            const stockChange = getStockChange(entry)
            
            return (
              <div 
                key={entry.id} 
                style={{ 
                  padding: '1.5rem',
                  borderBottom: index < filteredHistory.length - 1 ? '1px solid var(--border-color)' : 'none',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start'
                }}
              >
                {/* Type Icon */}
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '50%',
                  background: `${typeInfo.color}20`,
                  color: typeInfo.color,
                  flexShrink: 0
                }}>
                  <TypeIcon size={20} />
                </div>

                {/* Entry Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600 }}>
                        {entry.medicine}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {typeInfo.label} • {entry.reason}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                        {entry.timestamp}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        justifyContent: 'flex-end',
                        marginTop: '0.25rem'
                      }}>
                        <User size={12} />
                        {entry.user}
                      </div>
                    </div>
                  </div>

                  {/* Stock Change Details */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '1rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Quantity:</span>
                      <div style={{ fontWeight: 600, color: typeInfo.color }}>
                        {entry.type === 'reduction' ? '-' : '+'}{entry.quantity}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Previous Stock:</span>
                      <div style={{ fontWeight: 600 }}>{entry.previousStock}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>New Stock:</span>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{entry.newStock}</div>
                    </div>
                    {entry.batchNumber && (
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Batch:</span>
                        <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {entry.batchNumber}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  {(entry.supplier || entry.notes) && (
                    <div style={{ 
                      background: 'var(--bg-secondary)', 
                      padding: '0.75rem', 
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}>
                      {entry.supplier && (
                        <div style={{ marginBottom: entry.notes ? '0.5rem' : 0 }}>
                          <strong>Supplier:</strong> {entry.supplier}
                        </div>
                      )}
                      {entry.notes && (
                        <div>
                          <strong>Notes:</strong> {entry.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {filteredHistory.length === 0 && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '4rem 2rem',
          textAlign: 'center',
          color: 'var(--text-light)'
        }}>
          <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>
            No stock history found
          </h3>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}

export default StockHistory
