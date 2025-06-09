import { useState } from 'react';
import { Gift, Star, TrendingUp, Users, Award, Calendar } from 'lucide-react';

const LoyaltyProgram = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock loyalty data
  const loyaltyStats = {
    totalMembers: 1247,
    activeMembers: 892,
    totalPointsIssued: 125430,
    totalPointsRedeemed: 45230,
    avgPointsPerCustomer: 142,
    topTierMembers: 89
  };

  const loyaltyTiers = [
    {
      name: 'Bronze',
      minPoints: 0,
      maxPoints: 999,
      benefits: ['1% cashback', 'Birthday discount 5%'],
      members: 758,
      color: '#cd7f32'
    },
    {
      name: 'Silver',
      minPoints: 1000,
      maxPoints: 2999,
      benefits: ['2% cashback', 'Birthday discount 10%', 'Priority support'],
      members: 400,
      color: '#c0c0c0'
    },
    {
      name: 'Gold',
      minPoints: 3000,
      maxPoints: null,
      benefits: ['3% cashback', 'Birthday discount 15%', 'Free delivery', 'Exclusive offers'],
      members: 89,
      color: '#ffd700'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      customerName: 'Rajesh Kumar',
      type: 'earned',
      points: 45,
      description: 'Purchase - INV001234',
      date: new Date()
    },
    {
      id: 2,
      customerName: 'Priya Sharma',
      type: 'redeemed',
      points: 100,
      description: 'Discount applied',
      date: new Date()
    },
    {
      id: 3,
      customerName: 'Amit Patel',
      type: 'earned',
      points: 32,
      description: 'Purchase - INV001235',
      date: new Date()
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'tiers', label: 'Loyalty Tiers', icon: Award },
    { id: 'transactions', label: 'Point Transactions', icon: Gift },
    { id: 'settings', label: 'Program Settings', icon: Star }
  ];

  const renderOverview = () => (
    <div className="loyalty-overview">
      <div className="loyalty-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{loyaltyStats.totalMembers.toLocaleString()}</div>
            <div className="stat-label">Total Members</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{loyaltyStats.activeMembers.toLocaleString()}</div>
            <div className="stat-label">Active Members</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Gift size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{loyaltyStats.totalPointsIssued.toLocaleString()}</div>
            <div className="stat-label">Points Issued</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{loyaltyStats.totalPointsRedeemed.toLocaleString()}</div>
            <div className="stat-label">Points Redeemed</div>
          </div>
        </div>
      </div>

      <div className="tier-distribution">
        <h4>Member Distribution by Tier</h4>
        <div className="tier-chart">
          {loyaltyTiers.map((tier) => (
            <div key={tier.name} className="tier-bar">
              <div className="tier-info">
                <span className="tier-name" style={{ color: tier.color }}>{tier.name}</span>
                <span className="tier-count">{tier.members} members</span>
              </div>
              <div className="tier-progress">
                <div 
                  className="tier-fill" 
                  style={{ 
                    width: `${(tier.members / loyaltyStats.totalMembers) * 100}%`,
                    backgroundColor: tier.color
                  }}
                ></div>
              </div>
              <span className="tier-percentage">
                {Math.round((tier.members / loyaltyStats.totalMembers) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTiers = () => (
    <div className="loyalty-tiers">
      <div className="tiers-header">
        <h4>Loyalty Tier Structure</h4>
        <button className="btn btn-primary">Edit Tiers</button>
      </div>
      
      <div className="tiers-grid">
        {loyaltyTiers.map((tier) => (
          <div key={tier.name} className="tier-card" style={{ borderColor: tier.color }}>
            <div className="tier-header">
              <div className="tier-icon" style={{ backgroundColor: tier.color }}>
                <Award size={24} />
              </div>
              <h3>{tier.name}</h3>
            </div>
            
            <div className="tier-requirements">
              <p>
                {tier.minPoints} - {tier.maxPoints || '∞'} points
              </p>
            </div>
            
            <div className="tier-benefits">
              <h5>Benefits:</h5>
              <ul>
                {tier.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div className="tier-members">
              <span>{tier.members} members</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="loyalty-transactions">
      <div className="transactions-header">
        <h4>Recent Point Transactions</h4>
        <div className="header-actions">
          <button className="btn btn-outline">Export</button>
          <button className="btn btn-primary">Manual Adjustment</button>
        </div>
      </div>
      
      <div className="transactions-list">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="transaction-card">
            <div className="transaction-info">
              <div className="customer-name">{transaction.customerName}</div>
              <div className="transaction-description">{transaction.description}</div>
            </div>
            
            <div className="transaction-details">
              <div className={`transaction-points ${transaction.type}`}>
                {transaction.type === 'earned' ? '+' : '-'}{transaction.points} points
              </div>
              <div className="transaction-date">
                {transaction.date.toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="loyalty-settings">
      <div className="settings-section">
        <h4>Point Earning Rules</h4>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Points per ₹1 spent</label>
            <input type="number" defaultValue="1" className="form-input" />
          </div>
          <div className="setting-item">
            <label>Minimum purchase for points</label>
            <input type="number" defaultValue="100" className="form-input" />
          </div>
          <div className="setting-item">
            <label>Bonus points on birthday</label>
            <input type="number" defaultValue="100" className="form-input" />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h4>Point Redemption Rules</h4>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Minimum points for redemption</label>
            <input type="number" defaultValue="100" className="form-input" />
          </div>
          <div className="setting-item">
            <label>Point value (₹ per point)</label>
            <input type="number" step="0.01" defaultValue="1.00" className="form-input" />
          </div>
          <div className="setting-item">
            <label>Maximum redemption per transaction (%)</label>
            <input type="number" defaultValue="50" className="form-input" />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h4>Program Settings</h4>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span className="checkmark"></span>
            Enable loyalty program
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span className="checkmark"></span>
            Send birthday offers
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            <span className="checkmark"></span>
            SMS notifications for point updates
          </label>
          <label className="checkbox-label">
            <input type="checkbox" />
            <span className="checkmark"></span>
            Email monthly statements
          </label>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-outline">Reset to Defaults</button>
        <button className="btn btn-primary">Save Settings</button>
      </div>
    </div>
  );

  return (
    <div className="customer-container">
      {/* Header */}
      <div className="loyalty-header">
        <div className="header-content">
          <h3>Loyalty Program Management</h3>
          <p>Manage customer loyalty points, tiers, and rewards</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="loyalty-tabs">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="loyalty-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'tiers' && renderTiers()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default LoyaltyProgram;
