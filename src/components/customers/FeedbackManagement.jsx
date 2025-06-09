import { useState } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Clock, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const FeedbackManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock feedback data
  const feedback = [
    {
      id: 'FB001',
      customerName: 'Rajesh Kumar',
      customerPhone: '9876543210',
      type: 'complaint',
      subject: 'Medicine quality issue',
      description: 'The medicine I purchased last week seems to have quality issues. The tablets were broken.',
      date: new Date(),
      status: 'pending',
      priority: 'high',
      assignedTo: 'Dr. Sathya',
      resolution: ''
    },
    {
      id: 'FB002',
      customerName: 'Priya Sharma',
      customerPhone: '9876543211',
      type: 'suggestion',
      subject: 'Improve waiting time',
      description: 'The waiting time during peak hours is too long. Consider adding more staff or a token system.',
      date: new Date(),
      status: 'resolved',
      priority: 'medium',
      assignedTo: 'Store Manager',
      resolution: 'Implemented token system and added one more staff member during peak hours.'
    },
    {
      id: 'FB003',
      customerName: 'Amit Patel',
      customerPhone: '9876543212',
      type: 'compliment',
      subject: 'Excellent service',
      description: 'Very happy with the service provided. Staff is knowledgeable and helpful.',
      date: new Date(),
      status: 'resolved',
      priority: 'low',
      assignedTo: 'Store Manager',
      resolution: 'Appreciation noted and shared with team.'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Feedback', count: feedback.length },
    { id: 'pending', label: 'Pending', count: feedback.filter(f => f.status === 'pending').length },
    { id: 'resolved', label: 'Resolved', count: feedback.filter(f => f.status === 'resolved').length },
    { id: 'complaints', label: 'Complaints', count: feedback.filter(f => f.type === 'complaint').length }
  ];

  const getFilteredFeedback = () => {
    let filtered = feedback;

    if (activeTab !== 'all') {
      if (activeTab === 'complaints') {
        filtered = filtered.filter(f => f.type === 'complaint');
      } else {
        filtered = filtered.filter(f => f.status === activeTab);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.customerPhone.includes(searchTerm) ||
        f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'complaint':
        return <AlertTriangle size={16} className="type-icon complaint" />;
      case 'suggestion':
        return <MessageSquare size={16} className="type-icon suggestion" />;
      case 'compliment':
        return <CheckCircle size={16} className="type-icon compliment" />;
      default:
        return <MessageSquare size={16} className="type-icon query" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="status-icon pending" />;
      case 'resolved':
        return <CheckCircle size={16} className="status-icon resolved" />;
      default:
        return <MessageSquare size={16} className="status-icon" />;
    }
  };

  const filteredFeedback = getFilteredFeedback();

  return (
    <div className="customer-container">
      {/* Header */}
      <div className="feedback-header">
        <div className="header-content">
          <h3>Feedback & Complaints Management</h3>
          <p>Track and resolve customer feedback, complaints, and suggestions</p>
        </div>
        <button className="btn btn-primary">
          <MessageSquare size={16} />
          Add Feedback
        </button>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by customer name, phone, subject, or feedback ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="feedback-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="feedback-list">
        {filteredFeedback.map((item) => (
          <div key={item.id} className={`feedback-card ${item.priority}`}>
            <div className="feedback-header">
              <div className="feedback-info">
                <div className="feedback-id">{item.id}</div>
                <div className="customer-info">
                  <User size={14} />
                  <span>{item.customerName}</span>
                  <span className="phone">{item.customerPhone}</span>
                </div>
              </div>
              <div className="feedback-status">
                {getTypeIcon(item.type)}
                <span className={`type-label ${item.type}`}>{item.type}</span>
                {getStatusIcon(item.status)}
                <span className={`status-label ${item.status}`}>{item.status}</span>
              </div>
            </div>

            <div className="feedback-content">
              <h4>{item.subject}</h4>
              <p>{item.description}</p>
              
              {item.resolution && (
                <div className="feedback-resolution">
                  <strong>Resolution:</strong>
                  <p>{item.resolution}</p>
                </div>
              )}
            </div>

            <div className="feedback-meta">
              <div className="meta-info">
                <span className={`priority-badge ${item.priority}`}>
                  {item.priority} priority
                </span>
                <span>Assigned to: {item.assignedTo}</span>
                <span>
                  <Calendar size={12} />
                  {format(new Date(item.date), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
              
              <div className="feedback-actions">
                {item.status === 'pending' && (
                  <>
                    <button className="btn btn-outline btn-small">
                      Assign
                    </button>
                    <button className="btn btn-primary btn-small">
                      Resolve
                    </button>
                  </>
                )}
                <button className="btn btn-outline btn-small">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFeedback.length === 0 && (
        <div className="empty-state">
          <MessageSquare size={48} />
          <h3>No feedback found</h3>
          <p>No feedback matches your current filters</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="feedback-stats">
        <div className="stat-item">
          <span className="stat-label">Total Feedback:</span>
          <span className="stat-value">{feedback.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending:</span>
          <span className="stat-value pending">{feedback.filter(f => f.status === 'pending').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Resolved:</span>
          <span className="stat-value resolved">{feedback.filter(f => f.status === 'resolved').length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Resolution Rate:</span>
          <span className="stat-value">
            {Math.round((feedback.filter(f => f.status === 'resolved').length / feedback.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;
