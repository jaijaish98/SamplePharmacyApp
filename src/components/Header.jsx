import { Search, Bell, User, Menu } from 'lucide-react'
import './Header.css'

const Header = ({ activeSection }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const getPageTitle = (section) => {
    const titles = {
      dashboard: 'Dashboard',
      inventory: 'Inventory Management',
      stock: 'Stock Management',
      billing: 'Billing System',
      sales: 'Sales & Revenue',
      reports: 'Reports & Analytics',
      customers: 'Customer Management',
      prescriptions: 'Prescription Management',
      suppliers: 'Supplier Management',
      settings: 'Settings'
    }
    return titles[section] || 'Dashboard'
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn">
          <Menu size={24} />
        </button>
        <div className="header-info">
          <h1 className="page-title">{getPageTitle(activeSection)}</h1>
          <p className="current-date">{currentDate}</p>
        </div>
      </div>
      
      <div className="header-center">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search medicines, customers, prescriptions..."
            className="search-input"
          />
        </div>
      </div>
      
      <div className="header-right">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-menu">
          <button className="user-btn">
            <User size={20} />
            <span className="user-name">Admin</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
