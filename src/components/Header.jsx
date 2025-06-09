import { Search, Bell, User, Menu, LogOut } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import './Header.css'

const Header = ({ activeSection, user, onLogout, onToggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
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
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>
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

        <div className="user-menu" ref={userMenuRef}>
          <button
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <User size={20} />
            <span className="user-name">{user?.name || 'Admin'}</span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <div className="user-avatar">
                  <User size={16} />
                </div>
                <div className="user-details">
                  <div className="user-display-name">{user?.name || 'Admin'}</div>
                  <div className="user-email">{user?.email || 'admin@sathyapharmacy.com'}</div>
                  <div className="user-role">{user?.role || 'Administrator'}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                <User size={16} />
                Profile Settings
              </button>
              <button className="dropdown-item logout-btn" onClick={onLogout}>
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
