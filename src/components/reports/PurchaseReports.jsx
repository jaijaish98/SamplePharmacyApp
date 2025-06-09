import { useState } from 'react';
import { Download, ShoppingCart, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useReports } from '../../contexts/ReportsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PurchaseReports = () => {
  const { getPurchaseReports, loading } = useReports();
  const [selectedReport, setSelectedReport] = useState('purchase-summary');

  const { purchases, supplierSummary } = getPurchaseReports();
  
  const totalPurchases = purchases.length;
  const totalAmount = purchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
  const pendingPayments = purchases.filter(p => p.paymentStatus === 'pending').reduce((sum, p) => sum + p.totalCost, 0);
  const pendingOrders = purchases.filter(p => p.status === 'pending').length;

  const supplierChartData = Object.entries(supplierSummary).map(([supplier, data]) => ({
    supplier: supplier.split(' ')[0], // Shorten name for chart
    amount: data.totalAmount,
    orders: data.totalOrders
  }));

  const reportTypes = [
    { id: 'purchase-summary', label: 'Purchase Summary', icon: ShoppingCart },
    { id: 'vendor-wise', label: 'Vendor-wise Purchase Report', icon: TrendingUp },
    { id: 'pending-orders', label: 'Pending Purchase Orders', icon: Clock },
    { id: 'return-supplier', label: 'Return to Supplier Report', icon: CheckCircle }
  ];

  const handleExport = (format) => {
    console.log(`Exporting ${selectedReport} report in ${format} format`);
  };

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading purchase data...</p>
        </div>
      );
    }

    switch (selectedReport) {
      case 'purchase-summary':
        return (
          <div className="report-content">
            <div className="purchase-summary">
              <div className="summary-card primary">
                <div className="summary-icon">
                  <ShoppingCart size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{totalPurchases}</div>
                  <div className="summary-label">Total Purchases</div>
                </div>
              </div>
              <div className="summary-card secondary">
                <div className="summary-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{totalAmount.toLocaleString()}</div>
                  <div className="summary-label">Total Amount</div>
                </div>
              </div>
              <div className="summary-card warning">
                <div className="summary-icon">
                  <Clock size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">₹{pendingPayments.toLocaleString()}</div>
                  <div className="summary-label">Pending Payments</div>
                </div>
              </div>
              <div className="summary-card accent">
                <div className="summary-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="summary-content">
                  <div className="summary-value">{pendingOrders}</div>
                  <div className="summary-label">Pending Orders</div>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3>Recent Purchases</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Invoice No</th>
                      <th>Date</th>
                      <th>Supplier</th>
                      <th>Medicine</th>
                      <th>Quantity</th>
                      <th>Unit Cost</th>
                      <th>Total Cost</th>
                      <th>Payment Status</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.slice(0, 20).map((purchase) => (
                      <tr key={purchase.id}>
                        <td className="invoice-no">{purchase.invoiceNo}</td>
                        <td>{format(new Date(purchase.date), 'dd/MM/yyyy')}</td>
                        <td>{purchase.supplier}</td>
                        <td>{purchase.medicine}</td>
                        <td>{purchase.quantity}</td>
                        <td>₹{purchase.unitCost}</td>
                        <td>₹{purchase.totalCost.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${purchase.paymentStatus}`}>
                            {purchase.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${purchase.status}`}>
                            {purchase.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'vendor-wise':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Supplier Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supplierChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="supplier" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'amount' ? `₹${value.toLocaleString()}` : value,
                    name === 'amount' ? 'Total Amount' : 'Orders'
                  ]} />
                  <Bar dataKey="amount" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="report-section">
              <h3>Supplier Summary</h3>
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Supplier Name</th>
                      <th>Total Orders</th>
                      <th>Total Amount</th>
                      <th>Pending Amount</th>
                      <th>Avg Order Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(supplierSummary).map(([supplier, data]) => (
                      <tr key={supplier}>
                        <td>{supplier}</td>
                        <td>{data.totalOrders}</td>
                        <td>₹{data.totalAmount.toLocaleString()}</td>
                        <td>₹{data.pendingAmount.toLocaleString()}</td>
                        <td>₹{Math.round(data.totalAmount / data.totalOrders)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Report Coming Soon</h3>
              <p>This report is under development and will be available soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <div className="header-info">
          <h2>Purchase Reports</h2>
          <p>Analyze purchase trends and supplier relations</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => handleExport('pdf')}>
            <Download size={16} />
            Export PDF
          </button>
          <button className="btn btn-outline" onClick={() => handleExport('excel')}>
            <Download size={16} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="report-types">
        {reportTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.id}
              className={`report-type-btn ${selectedReport === type.id ? 'active' : ''}`}
              onClick={() => setSelectedReport(type.id)}
            >
              <IconComponent size={20} />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
};

export default PurchaseReports;
