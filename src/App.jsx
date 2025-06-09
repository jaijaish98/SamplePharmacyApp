import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import InventoryManagement from './components/InventoryManagement'
import StockManagement from './components/StockManagement'
import BillingSystem from './components/BillingSystem'
import SalesRevenue from './components/SalesRevenue'
import ReportsAnalytics from './components/ReportsAnalytics'
import CustomerManagement from './components/CustomerManagement'
import PrescriptionManagement from './components/PrescriptionManagement'
import SupplierManagement from './components/SupplierManagement'
import Settings from './components/Settings'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogin = (userData) => {
    console.log('User logged in:', userData)
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setActiveSection('dashboard')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'inventory':
        return <InventoryManagement />
      case 'stock':
        return <StockManagement />
      case 'billing':
        return <BillingSystem />
      case 'sales':
        return <SalesRevenue />
      case 'reports':
        return <ReportsAnalytics />
      case 'customers':
        return <CustomerManagement />
      case 'prescriptions':
        return <PrescriptionManagement />
      case 'suppliers':
        return <SupplierManagement />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <ThemeProvider>
      <div className="app">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        <div className="main-content">
          <Header
            activeSection={activeSection}
            user={user}
            onLogout={handleLogout}
            onToggleSidebar={toggleSidebar}
          />
          <main className="content">
            {renderContent()}
          </main>
        </div>
        {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      </div>
    </ThemeProvider>
  )
}

export default App
