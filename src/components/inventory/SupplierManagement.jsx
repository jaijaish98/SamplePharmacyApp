import { useState } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  FileText,
  DollarSign,
  Package
} from 'lucide-react'

const SupplierManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Sample supplier data
  const suppliers = [
    {
      id: 1,
      name: 'MedSupply Co.',
      contactPerson: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@medsupply.com',
      address: '123 Medical Street, Mumbai, Maharashtra 400001',
      gstNumber: '27ABCDE1234F1Z5',
      totalPurchases: 245680.00,
      activeMedicines: 15,
      lastOrderDate: '2024-02-15',
      status: 'active',
      rating: 4.5
    },
    {
      id: 2,
      name: 'PharmaCorp',
      contactPerson: 'Priya Sharma',
      phone: '+91 87654 32109',
      email: 'priya@pharmacorp.com',
      address: '456 Pharma Avenue, Delhi, Delhi 110001',
      gstNumber: '07FGHIJ5678K2L6',
      totalPurchases: 189450.00,
      activeMedicines: 12,
      lastOrderDate: '2024-02-10',
      status: 'active',
      rating: 4.2
    },
    {
      id: 3,
      name: 'HealthMeds',
      contactPerson: 'Amit Patel',
      phone: '+91 76543 21098',
      email: 'amit@healthmeds.com',
      address: '789 Health Plaza, Bangalore, Karnataka 560001',
      gstNumber: '29MNOPQ9012R3S7',
      totalPurchases: 156780.00,
      activeMedicines: 8,
      lastOrderDate: '2024-01-28',
      status: 'active',
      rating: 4.0
    },
    {
      id: 4,
      name: 'VitaCorp',
      contactPerson: 'Sunita Reddy',
      phone: '+91 65432 10987',
      email: 'sunita@vitacorp.com',
      address: '321 Vitamin Street, Hyderabad, Telangana 500001',
      gstNumber: '36TUVWX3456Y4Z8',
      totalPurchases: 98750.00,
      activeMedicines: 6,
      lastOrderDate: '2024-02-05',
      status: 'inactive',
      rating: 3.8
    }
  ]

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? { label: 'Active', class: 'status-active' }
      : { label: 'Inactive', class: 'status-inactive' }
  }

  const getRatingStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
  }

  return (
    <div className="supplier-management" style={{ padding: '2rem' }}>
      <div className="supplier-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '2rem',
        gap: '2rem'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Supplier Management
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
            Manage suppliers and track purchase history
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={20} style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-light)' 
          }} />
          <input
            type="text"
            placeholder="Search suppliers..."
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
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        {[
          { label: 'Total Suppliers', value: suppliers.length, icon: Users, color: 'var(--primary-color)' },
          { label: 'Active Suppliers', value: suppliers.filter(s => s.status === 'active').length, icon: Users, color: 'var(--secondary-color)' },
          { label: 'Total Purchase Value', value: formatCurrency(suppliers.reduce((sum, s) => sum + s.totalPurchases, 0)), icon: DollarSign, color: 'var(--accent-color)' },
          { label: 'Active Medicines', value: suppliers.reduce((sum, s) => sum + s.activeMedicines, 0), icon: Package, color: 'var(--primary-color)' }
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

      {/* Suppliers Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {filteredSuppliers.map((supplier) => {
          const statusBadge = getStatusBadge(supplier.status)
          return (
            <div key={supplier.id} style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              transition: 'var(--transition)'
            }}>
              {/* Card Header */}
              <div style={{ 
                padding: '1.5rem 1.5rem 1rem 1.5rem', 
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 600 }}>
                    {supplier.name}
                  </h3>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Contact: {supplier.contactPerson}
                  </p>
                  <div style={{ fontSize: '0.875rem', color: 'var(--accent-color)' }}>
                    {getRatingStars(supplier.rating)} ({supplier.rating})
                  </div>
                </div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: supplier.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                  color: supplier.status === 'active' ? 'var(--secondary-color)' : 'var(--text-light)'
                }}>
                  {statusBadge.label}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1rem 1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={16} style={{ color: 'var(--text-light)' }} />
                    <span style={{ fontSize: '0.875rem' }}>{supplier.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={16} style={{ color: 'var(--text-light)' }} />
                    <span style={{ fontSize: '0.875rem' }}>{supplier.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <MapPin size={16} style={{ color: 'var(--text-light)', marginTop: '0.125rem' }} />
                    <span style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>{supplier.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} style={{ color: 'var(--text-light)' }} />
                    <span style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>GST: {supplier.gstNumber}</span>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr', 
                  gap: '1rem', 
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      Total Purchases
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary-color)' }}>
                      {formatCurrency(supplier.totalPurchases)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      Medicines
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                      {supplier.activeMedicines}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      Last Order
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
                      {new Date(supplier.lastOrderDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ 
                padding: '1rem 1.5rem', 
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem'
              }}>
                <button style={{
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}>
                  <Edit size={16} />
                </button>
                <button style={{
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredSuppliers.length === 0 && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '4rem 2rem',
          textAlign: 'center',
          color: 'var(--text-light)'
        }}>
          <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>
            No suppliers found
          </h3>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
}

export default SupplierManagement
