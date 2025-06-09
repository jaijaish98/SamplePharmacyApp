import { 
  Home, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  FileText, 
  Truck, 
  Settings,
  Activity,
  DollarSign
} from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ activeSection, setActiveSection, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inventory', label: 'Inventory Management', icon: Package },
    { id: 'stock', label: 'Stock Management', icon: Activity },
    { id: 'billing', label: 'Billing System', icon: ShoppingCart },
    { id: 'sales', label: 'Sales & Revenue', icon: DollarSign },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'customers', label: 'Customer Management', icon: Users },
    { id: 'prescriptions', label: 'Prescription Management', icon: FileText },
    { id: 'suppliers', label: 'Supplier Management', icon: Truck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId)
    if (onClose) {
      onClose() // Close sidebar on mobile after navigation
    }
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="pharmacy-logo">
          <div className="logo-icon">
            <div className="pharmacy-pill">
              <div className="pill-left"></div>
              <div className="pill-right"></div>
            </div>
          </div>
          <div className="pharmacy-name">
            <h1>Sathya</h1>
            <h2>Pharmacy</h2>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <IconComponent size={20} className="nav-icon" />
                  <span className="nav-text">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      {/* <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <Users size={20} />
          </div>
          <div className="user-details">
            <p className="user-name">Admin User</p>
            <p className="user-role">Pharmacist</p>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Sidebar
