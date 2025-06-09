import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import InventoryManagement from './components/InventoryManagement'
// import StockManagement from './components/StockManagement'
// import BillingSystem from './components/BillingSystem'
import SalesRevenue from './components/SalesRevenue'
import Settings from './components/Settings'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'stock':
        return <div className="coming-soon">Sales & Revenue - Coming Soon</div>
      case 'inventory':
        return <InventoryManagement />
      case 'billing':
        return <div className="coming-soon">Sales & Revenue - Coming Soon</div>
      case 'sales':
        return <SalesRevenue />
      case 'reports':
        return <div className="coming-soon">Reports & Analytics - Coming Soon</div>
      case 'customers':
        return <div className="coming-soon">Customer Management - Coming Soon</div>
      case 'prescriptions':
        return <div className="coming-soon">Prescription Management - Coming Soon</div>
      case 'suppliers':
        return <div className="coming-soon">Supplier Management - Coming Soon</div>
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">
        <Header activeSection={activeSection} />
        <main className="content">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App
