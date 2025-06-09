import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Activity,
  ShoppingCart,
  FileText
} from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,680',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Total Medicines',
      value: '1,247',
      change: '+3.2%',
      trend: 'up',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Active Customers',
      value: '892',
      change: '+8.1%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '-5.4%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'orange'
    }
  ]

  const recentActivities = [
    { id: 1, type: 'sale', description: 'Sale completed for customer John Doe', time: '2 minutes ago', amount: '₹450' },
    { id: 2, type: 'stock', description: 'Stock updated for Paracetamol 500mg', time: '15 minutes ago', amount: '+50 units' },
    { id: 3, type: 'prescription', description: 'New prescription added for patient Mary Smith', time: '1 hour ago', amount: '5 items' },
    { id: 4, type: 'sale', description: 'Sale completed for customer Robert Johnson', time: '2 hours ago', amount: '₹1,200' },
  ]

  const lowStockItems = [
    { name: 'Paracetamol 500mg', current: 12, minimum: 50, supplier: 'MedSupply Co.' },
    { name: 'Amoxicillin 250mg', current: 8, minimum: 30, supplier: 'PharmaCorp' },
    { name: 'Ibuprofen 400mg', current: 15, minimum: 40, supplier: 'HealthMeds' },
    { name: 'Cough Syrup', current: 5, minimum: 25, supplier: 'MedSupply Co.' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Sathya Pharmacy</h1>
        <p>Here's what's happening with your pharmacy today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                <IconComponent size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.trend}`}>
                  <TrendingUp size={16} />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Activities</h2>
            <Activity size={20} />
          </div>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'sale' && <ShoppingCart size={16} />}
                  {activity.type === 'stock' && <Package size={16} />}
                  {activity.type === 'prescription' && <FileText size={16} />}
                </div>
                <div className="activity-content">
                  <p className="activity-description">{activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <div className="activity-amount">{activity.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <div className="card-header">
            <h2>Low Stock Alert</h2>
            <AlertTriangle size={20} />
          </div>
          <div className="stock-list">
            {lowStockItems.map((item, index) => (
              <div key={index} className="stock-item">
                <div className="stock-info">
                  <h4 className="stock-name">{item.name}</h4>
                  <p className="stock-supplier">Supplier: {item.supplier}</p>
                </div>
                <div className="stock-quantity">
                  <span className="current-stock">{item.current}</span>
                  <span className="stock-separator">/</span>
                  <span className="minimum-stock">{item.minimum}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn primary">
            <ShoppingCart size={20} />
            <span>New Sale</span>
          </button>
          <button className="action-btn secondary">
            <Package size={20} />
            <span>Add Stock</span>
          </button>
          <button className="action-btn tertiary">
            <FileText size={20} />
            <span>New Prescription</span>
          </button>
          <button className="action-btn quaternary">
            <Users size={20} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
