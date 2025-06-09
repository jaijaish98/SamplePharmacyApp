import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
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
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="main-content">
          <Header activeSection={activeSection} />
          <main className="content">
            {renderContent()}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
