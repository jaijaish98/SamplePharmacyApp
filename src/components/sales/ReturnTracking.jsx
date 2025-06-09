import { useState } from 'react';
import { RefreshCw, Search, Filter, Eye, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const ReturnTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const returnsData = [
    {
      id: 'RET001',
      originalInvoice: 'INV000123',
      date: new Date('2024-01-15'),
      customer: 'Rajesh Kumar',
      items: [
        { name: 'Paracetamol 500mg', quantity: 2, amount: 120, reason: 'Expired' }
      ],
      totalAmount: 120,
      status: 'processed',
      refundMethod: 'Cash',
      processedBy: 'Dr. Sathya'
    },
    {
      id: 'RET002',
      originalInvoice: 'INV000145',
      date: new Date('2024-01-14'),
      customer: 'Priya Sharma',
      items: [
        { name: 'Crocin Advance', quantity: 1, amount: 85, reason: 'Wrong medicine' }
      ],
      totalAmount: 85,
      status: 'pending',
      refundMethod: 'UPI',
      processedBy: null
    }
  ];

  const filteredReturns = returnsData.filter(returnItem => {
    const matchesSearch = returnItem.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.originalInvoice.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || returnItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalReturns = returnsData.length;
  const totalRefundAmount = returnsData.reduce((sum, item) => sum + item.totalAmount, 0);
  const pendingReturns = returnsData.filter(item => item.status === 'pending').length;

  return (
    <div className="return-tracking">
      <div className="returns-header">
        <div className="header-info">
          <h2>Returns & Refund Tracking</h2>
          <p>Track and manage product returns and customer refunds</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export Returns
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="returns-summary">
        <div className="summary-card">
          <div className="summary-icon warning">
            <RefreshCw size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-value">{totalReturns}</div>
            <div className="summary-label">Total Returns</div>
            <div className="summary-detail">This month</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon danger">
            <AlertTriangle size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-value">{pendingReturns}</div>
            <div className="summary-label">Pending Returns</div>
            <div className="summary-detail">Needs processing</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon primary">
            <CheckCircle size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-value">₹{totalRefundAmount.toLocaleString()}</div>
            <div className="summary-label">Total Refunds</div>
            <div className="summary-detail">This month</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="returns-filters">
        <div className="search-filter">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by customer or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processed">Processed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Returns Table */}
      <div className="returns-table-container">
        <table className="returns-table">
          <thead>
            <tr>
              <th>Return ID</th>
              <th>Original Invoice</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Refund Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.map((returnItem) => (
              <tr key={returnItem.id}>
                <td className="return-id">{returnItem.id}</td>
                <td className="invoice-link">{returnItem.originalInvoice}</td>
                <td className="date-cell">{format(returnItem.date, 'dd/MM/yyyy')}</td>
                <td className="customer-cell">{returnItem.customer}</td>
                <td className="items-cell">
                  {returnItem.items.map((item, index) => (
                    <div key={index} className="return-item">
                      <div className="item-name">{item.name}</div>
                      <div className="item-details">
                        Qty: {item.quantity} | Reason: {item.reason}
                      </div>
                    </div>
                  ))}
                </td>
                <td className="amount-cell">₹{returnItem.totalAmount.toLocaleString()}</td>
                <td className="status-cell">
                  <span className={`status-badge ${returnItem.status}`}>
                    {returnItem.status}
                  </span>
                </td>
                <td className="refund-method">{returnItem.refundMethod}</td>
                <td className="actions-cell">
                  <button className="btn-icon" title="View Details">
                    <Eye size={16} />
                  </button>
                  {returnItem.status === 'pending' && (
                    <button className="btn-small btn-primary">Process</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Return Reasons Analysis */}
      <div className="return-analysis">
        <h3>Return Reasons Analysis</h3>
        <div className="reasons-chart">
          <div className="reason-item">
            <div className="reason-bar">
              <div className="bar-fill" style={{ width: '45%' }}></div>
            </div>
            <div className="reason-label">Expired Medicine (45%)</div>
          </div>
          <div className="reason-item">
            <div className="reason-bar">
              <div className="bar-fill" style={{ width: '30%' }}></div>
            </div>
            <div className="reason-label">Wrong Medicine (30%)</div>
          </div>
          <div className="reason-item">
            <div className="reason-bar">
              <div className="bar-fill" style={{ width: '15%' }}></div>
            </div>
            <div className="reason-label">Damaged Package (15%)</div>
          </div>
          <div className="reason-item">
            <div className="reason-bar">
              <div className="bar-fill" style={{ width: '10%' }}></div>
            </div>
            <div className="reason-label">Customer Changed Mind (10%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnTracking;
